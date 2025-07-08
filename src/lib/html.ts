import { Ribbon } from "./build.js";
import { regexp } from "./shares/re.js";
import ReTests from "./shares/retest.js";
import type {
	CloseToken,
	JsonMLAttributes,
	OpenToken,
	SingleToken,
	TagName,
	Token,
} from "./shares/types.js";

export const singletons = {
	area: 1,
	base: 1,
	br: 1,
	col: 1,
	embed: 1,
	hr: 1,
	img: 1,
	input: 1,
	link: 1,
	meta: 1,
	option: 1,
	param: 1,
	wbr: 1,
};

export function parseHtmlAttr(attrSrc: string) {
	// parse ATTR and add to element
	const attr = <JsonMLAttributes>{};
	let m: RegExpExecArray | null = null;
	while ((m = regexp.reAttr.exec(attrSrc))) {
		attr[m[1]] =
			typeof m[2] === "string" ? m[2].replace(/^(["'])(.*)\1$/, "$2") : null;
		attrSrc = attrSrc.slice(m[0].length);
	}
	return attr;
}
export function tokenize(
	src: string,
	whitelistTags?: { [x: string]: any },
	lazy?: any,
) {
	const tokens: Token[] = [];
	let textMode: boolean | null | TagName = false;
	const oktag = (tag: TagName) => {
		if (textMode) {
			return tag === textMode;
		}
		if (whitelistTags) {
			return tag in whitelistTags;
		}
		return true;
	};
	let m: RegExpExecArray | null = null;
	const nesting = <Record<string, any>>{};
	let nestCount = 0;
	const ribbon = new Ribbon(src);
	do {
		// comment
		if ((m = ReTests.testComment(src)) && oktag("!")) {
			tokens.push({
				type: "COMMENT",
				data: m[1],
				pos: ribbon.index(),
				src: m[0],
			});
			ribbon.advance(m[0]);
			src = ribbon.toString();
		}
		// end tag
		else if ((m = ReTests.testCloseTag(src)) && oktag(m[1] as TagName)) {
			const token: CloseToken = {
				type: "CLOSE",
				tag: m[1] as TagName,
				pos: ribbon.index(),
				src: m[0],
			};
			ribbon.advance(m[0]);
			tokens.push(token);
			nesting[token.tag]--;
			nestCount--;
			// console.log( '/' + token.tag, nestCount, nesting );
			if (
				lazy &&
				(!nestCount ||
					nesting[token.tag] >= 0 ||
					Number.isNaN(nesting[token.tag]))
			) {
				return tokens;
			}
			// if parse is in text mode then that ends here
			if (textMode) {
				textMode = null;
			}
			src = ribbon.toString();
		}
		// ---
		// open/void tag
		else if ((m = ReTests.testOpenTag(src)) && oktag(m[1] as TagName)) {
			const token: OpenToken | SingleToken = {
				type: m[3] || m[1] in singletons ? "SINGLE" : "OPEN",
				tag: m[1] as TagName,
				pos: ribbon.index(),
				src: m[0],
			};
			if (m[2]) {
				token.attr = parseHtmlAttr(m[2]);
			}
			// some elements can move parser into "text" mode
			if (m[1] === "script" || m[1] === "code" || m[1] === "style") {
				textMode = token.tag;
			}
			if (token.type === "OPEN") {
				nestCount++;
				nesting[token.tag] = (nesting[token.tag] || 0) + 1;
				// console.log( token.tag, nestCount, nesting );
			}
			tokens.push(token);
			ribbon.advance(m[0]);
			src = ribbon.toString();
		}
		// text content
		else {
			// no match, move by all "uninteresting" chars
			m = /([^<]+|[^\0])/.exec(src);
			if (m) {
				tokens.push({
					type: "TEXT",
					data: m[0],
					pos: ribbon.index(),
					src: m[0],
				});
			}
			ribbon.advance(m ? m[0].length || 1 : 1);
			src = ribbon.toString();
		}
	} while (ribbon.valueOf());
	return tokens;
}

export function parseHtml(tokens: Token[], lazy?: any) {
	const root: any = [];
	const stack = [];
	let curr = root;
	let token = <Token>{};
	for (let i = 0; i < tokens.length; i++) {
		token = tokens[i];
		if (token.type === "COMMENT") {
			curr.push(["!", token.data]);
		} else if (token.type === "TEXT" || token.type === "WS") {
			curr.push(token.data);
		} else if (token.type === "SINGLE") {
			curr.push(token.attr ? [token.tag, token.attr] : [token.tag]);
		} else if (token.type === "OPEN") {
			// TODO: some things auto close other things: <td>, <li>, <p>, <table>
			// https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-omission
			const elm = token.attr ? [token.tag, token.attr] : [token.tag];
			curr.push(elm);
			stack.push(elm);
			curr = elm;
		} else if (token.type === "CLOSE") {
			if (stack.length) {
				for (let i = stack.length - 1; i >= 0; i--) {
					const head = stack[i];
					if (head[0] === token.tag) {
						stack.splice(i);
						curr = stack[stack.length - 1] || root;
						break;
					}
				}
			}
			if (!stack.length && lazy) {
				root.sourceLength = token.pos + token.src.length;
				return root;
			}
		}
	}
	root.sourceLength = token ? token.pos + token.src.length : 0;
	return root;
}
