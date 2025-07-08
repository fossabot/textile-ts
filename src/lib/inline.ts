import { parseAttr } from "./attr.js";
import { Builder, Ribbon } from "./build.js";
import parseGlyph from "./glyph.js";
import { parseHtml, parseHtmlAttr, singletons, tokenize } from "./html.js";
import { compile, escape_sc, regexp } from "./shares/re.js";
import ReTests from "./shares/retest.js";
import type {
	JsonMLAttributes,
	JsonMLElement,
	JsonMLNode,
	Options,
	TagName,
} from "./shares/types.js";

const phraseConvert = {
	"*": "strong",
	"**": "b",
	"??": "cite",
	_: "em",
	__: "i",
	"-": "del",
	"%": "span",
	"+": "ins",
	"~": "sub",
	"^": "sup",
	"@": "code",
};
//
export default function parseInline(src: string, options?: Options) {
	const ribbon = new Ribbon(src);
	const list = new Builder();
	let m: RegExpExecArray | null = null;
	let pba: any;
	do {
		ribbon.save();
		src = ribbon.toString();
		// linebreak -- having this first keeps it from messing to much with other phrases
		if (src.startsWith("\r\n")) {
			ribbon.advance(1); // skip cartridge returns
			ribbon.toString();
		}
		// ---
		if (src.startsWith("\n")) {
			ribbon.advance(1);
			if (src.startsWith(" ")) {
				ribbon.advance(1);
			} else if (options?.breaks) {
				list.add(["br"]);
			}
			list.add("\n");
			src = ribbon.toString();
			continue;
		}
		// inline notextile
		if ((m = /^==(.*?)==/.exec(src))) {
			ribbon.advance(m[0]);
			ribbon.toString();
			list.add(m[1]);
			continue;
		}
		// --
		// lookbehind => /([\s>.,"'?!;:])$/
		const behind = ribbon.lookbehind(1);
		const boundary = !behind || /^[\s<>.,"'?!;:()[\]%{}]$/.test(behind);
		// FIXME: need to test right boundary for phrases as well
		if ((m = regexp.rePhrase.exec(src)) && (boundary || m[1])) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			const tok = m[2];
			const fence = m[1];
			const phraseType = phraseConvert[tok as keyof typeof phraseConvert];
			const code = phraseType === "code";
			if ((pba = !code && parseAttr(src, phraseType as TagName, tok))) {
				ribbon.advance(pba[0]);
				src = ribbon.toString();
				pba = pba[1];
			}
			// FIXME: if we can't match the fence on the end, we should output fence-prefix as normal text
			// seek end
			let mMid: string;
			let mEnd: string;
			//const escapedTok = escape_sc(tok);
			if (fence === "[") {
				mMid = "^(.*?)";
				mEnd = "(?:])";
			} else if (fence === "{") {
				mMid = "^(.*?)";
				mEnd = "(?:})";
			} else {
				const t1 = escape_sc(tok.charAt(0));
				mMid = code
					? "^(\\S+|\\S+.*?\\S)"
					: `^([^\\s${t1}]+|[^\\s${t1}].*?\\S(${t1}*))`;
				mEnd = "(?=$|[\\s.,\"'!?;:()«»„“”‚‘’<>])";
			}
			const rx = compile(`${mMid}(${escape_sc(tok)})${mEnd}`);
			if ((m = rx.exec(src)) && m[1]) {
				ribbon.advance(m[0]);
				src = ribbon.toString();
				if (code) {
					list.add([phraseType, m[1]]);
				} else {
					list.add(
						[phraseType, pba].concat(parseInline(m[1], options)) as JsonMLNode,
					);
				}
				continue;
			}
			// else
			ribbon.load();
			src = ribbon.toString();
		}
		// ===
		// image
		if (
			(m = regexp.reImage.exec(src)) ||
			(m = regexp.reImageFenced.exec(src))
		) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			pba = m[1] && parseAttr(m[1], "img");
			const attr = pba ? pba[1] : { src: "" };
			let img: JsonMLNode = ["img", attr];
			attr.src = m[2];
			attr.alt = m[3] ? (attr.title = m[3]) : "";

			if (m[4]) {
				// +cite causes image to be wraped with a link (or link_ref)?
				// TODO: support link_ref for image cite
				img = ["a", { href: m[4] }, img];
			}
			list.add(img);
			continue;
		}
		// html comment
		if ((m = ReTests.testComment(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			list.add(["!", m[1]]);
			continue;
		}
		// html tag
		// TODO: this seems to have a lot of overlap with block tags... DRY?
		if ((m = ReTests.testOpenTag(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			const tag = m[1] as TagName;
			const single = m[3] || m[1] in singletons;
			let element = [tag];
			if (m[2]) {
				element.push(parseHtmlAttr(m[2]) as any);
			}
			if (single) {
				// single tag
				list.add(element as JsonMLElement).add(ribbon.skipWS());
				continue;
			} else {
				// need terminator
				// gulp up the rest of this block...
				const reEndTag = compile(`^(.*?)(</${tag}\\s*>)`, "s");
				if ((m = reEndTag.exec(src))) {
					ribbon.advance(m[0]);
					src = ribbon.toString();
					if (tag === "code") {
						element.push(m[1] as any);
					} else if (tag === "notextile") {
						// HTML is still parsed, even though textile is not
						list.merge(parseHtml(tokenize(m[1])));
						continue;
					} else {
						element = element.concat(parseInline(m[1], options) as any);
					}
					list.add(element as JsonMLElement);
					continue;
				}
				// end tag is missing, treat tag as normal text...
			}
			ribbon.load();
			src = ribbon.toString();
		}
		// footnote
		if ((m = regexp.reFootnote.exec(src)) && /\S/.test(behind)) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			list.add([
				"sup",
				{ class: "footnote", id: `fnr${m[1]}` },
				m[2] === "!"
					? m[1] // "!" suppresses the link
					: ["a", { href: `#fn${m[1]}` }, m[1]],
			] as any);
			continue;
		}
		// caps / abbr
		if ((m = regexp.reCaps.exec(src))) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			let caps = [
				"span" as TagName,
				{ class: "caps" } as JsonMLAttributes,
				m[1] as string,
			];
			if (m[2]) {
				// FIXME: use <abbr>, not acronym!
				caps = ["acronym", { title: m[2] }, caps];
			}
			list.add(caps as JsonMLElement);
			continue;
		}
		// links
		if (
			(boundary && (m = regexp.reLink.exec(src))) ||
			(m = regexp.reLinkFenced.exec(src))
		) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
			let title: RegExpMatchArray | null | string = m[1].match(
				regexp.reLinkTitle,
			);
			let inner = title ? m[1].slice(0, m[1].length - title[0].length) : m[1];
			if ((pba = parseAttr(inner, "a"))) {
				inner = inner.slice(pba[0]);
				pba = pba[1];
			} else {
				pba = {};
			}
			if (title && !inner) {
				inner = title[0];
				title = "";
			}
			pba.href = m[2];
			if (title) {
				pba.title = title[1];
			}
			// links may self-reference their url via $
			if (inner === "$") {
				inner = pba.href.replace(/^(https?:\/\/|ftps?:\/\/|mailto:)/, "");
			}
			list.add(
				["a", pba].concat(
					parseInline(inner.replace(/^(\.?\s*)/, ""), options),
				) as JsonMLNode,
			);
			continue;
		}
		// no match, move by all "uninteresting" chars
		m = /([a-zA-Z0-9,.':]+|[ \f\r\t\v\xA0\u2028\u2029]+|[^\0])/.exec(src);
		if (m) {
			list.add(m[0]);
		}
		ribbon.advance(m ? m[0].length || 1 : 1);
		src = ribbon.toString();
	} while (ribbon.valueOf());
	return list.get().map(parseGlyph);
}
