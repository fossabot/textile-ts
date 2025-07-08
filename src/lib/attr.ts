import { regexp } from "./shares/re.js";
import ReTests from "./shares/retest.js";
import type { JsonMLAttributes, TagName } from "./shares/types.js";
export function copyAttr(
	s: { [x: string]: any },
	blacklist?: { [x: string]: any },
) {
	if (!s) {
		return undefined;
	}
	const d: { [x: string]: any } = {};
	for (const k in s) {
		if (k in s && (!blacklist || !(k in blacklist))) {
			d[k] = s[k];
		}
	}
	return d;
}

const pbaAlignLookup = {
	"<": "left",
	"=": "center",
	">": "right",
	"<>": "justify",
};

const pbaVAlignLookup = {
	"~": "bottom",
	"^": "top",
	"-": "middle",
};

export function parseAttr(input: string, element: TagName, endToken?: string) {
	if (element === "notextile") {
		return undefined;
	}
	let m: RegExpExecArray | null = null;
	const st: Record<string, string> = {};
	const o = <JsonMLAttributes>{};
	let remaining = input;
	//
	const isBlock = ReTests.testBlock(element);
	const isImg = element === "img";
	const isList = element === "li";
	const isPhrase = !isBlock && !isImg && element !== "a";
	const reAlign = isImg ? regexp.reAlignImg : regexp.reAlignBlock;
	//
	do {
		if ((m = regexp.reStyles.exec(remaining))) {
			m[1].split(";").forEach((p) => {
				const d = p.match(regexp.reCSS);
				if (d) {
					st[d[1]] = d[2];
				}
			});
			remaining = remaining.slice(m[0].length);
			continue;
		}
		// --
		if ((m = regexp.reLang.exec(remaining))) {
			const rm = remaining.slice(m[0].length);
			if (
				(!rm && isPhrase) ||
				(endToken && endToken === rm.slice(0, endToken.length))
			) {
				m = null;
			} else {
				o.lang = m[1];
				remaining = remaining.slice(m[0].length);
			}
			continue;
		}
		// ---
		if ((m = regexp.reClassid.exec(remaining))) {
			const rm = remaining.slice(m[0].length);
			if (
				(!rm && isPhrase) ||
				(endToken &&
					(rm[0] === " " || endToken === rm.slice(0, endToken.length)))
			) {
				m = null;
			} else {
				//TODO lang in codeblock
				const bits = m[1].split("#");
				if (bits[0]) {
					o.class = bits[0].trimStart().trimEnd();
				}
				if (bits[1]) {
					o.id = bits[1];
				}
				remaining = rm;
			}
			continue;
		}
		//---
		if (isBlock || isList) {
			if ((m = regexp.rePaddingL.exec(remaining))) {
				st["padding-left"] = `${m[1].length}em`;
				remaining = remaining.slice(m[0].length);
				continue;
			}
			if ((m = regexp.rePaddingR.exec(remaining))) {
				st["padding-right"] = `${m[1].length}em`;
				remaining = remaining.slice(m[0].length);
				continue;
			}
		}
		// ---
		// only for blocks:
		if (isImg || isBlock || isList) {
			if ((m = reAlign.exec(remaining))) {
				const align = pbaAlignLookup[m[1] as keyof typeof pbaAlignLookup];
				if (isImg) {
					o.align = align;
				} else {
					st["text-align"] = align;
				}
				remaining = remaining.slice(m[0].length);
				continue;
			}
		}
		// only for table cells
		if (element === "td" || element === "tr") {
			if ((m = regexp.reVAlign.exec(remaining))) {
				st["vertical-align"] =
					pbaVAlignLookup[m[1] as keyof typeof pbaVAlignLookup];
				remaining = remaining.slice(m[0].length);
				continue;
			}
		}
		// ---
		if (element === "td") {
			if ((m = regexp.reColSpan.exec(remaining))) {
				o.colspan = m[1];
				remaining = remaining.slice(m[0].length);
				continue;
			}
			if ((m = regexp.reRowSpan.exec(remaining))) {
				o.rowspan = m[1];
				remaining = remaining.slice(m[0].length);
			}
		}
	} while (m);
	// collapse styles
	const s: string[] = [];
	for (const v in st) {
		s.push(`${v}:${st[v]}`);
	}
	if (s.length) {
		o.style = `${s.join(";")};`;
	}
	return remaining === input ? undefined : [input.length - remaining.length, o];
}
