import * as htmlparser2 from "htmlparser2";
import Constants from "./shares/constants.js";
import { escapeHTML, isAttr } from "./shares/helpers.js";
import type {
	JsonMLAttributes,
	JsonMLElement,
	JsonMLNode,
	JsonMLNodes,
	JsonMLRoot,
	TagName,
} from "./shares/types.js";
// ==============================================================================//
/**
 * html2JML takes a string of HTML and returns a JSON-ML representation of that
 * HTML. The JSON-ML representation is a tree of arrays where the first element of
 * each array is the tag name, the second element is an object of attributes, and
 * the remaining elements are the contents of that tag.
 *
 * @param html - the HTML string to be converted
 * @returns the JSON-ML representation of the HTML
 */
export const html2JML = (html: string) => {
	const result: JsonMLRoot = [];
	let current: any | null = null;
	const stack: JsonMLNodes = [];
	const parser = new htmlparser2.Parser(
		{
			onopentag(name, attribs) {
				const eln: JsonMLElement = [name as TagName];
				if (Object.keys(attribs).length > 0) {
					eln.push(attribs as any);
				}
				if (current) {
					(current as JsonMLNodes).push(eln);
					stack.push(current);
				} else {
					result.push(eln);
				}
				current = eln;
			},
			ontext(text) {
				if (current) {
					current.push(text);
				} else {
					result.push(text);
				}
			},
			onclosetag() {
				if (stack.length > 0) {
					current = stack.pop();
				} else {
					current = null;
				}
			},
		},
		{ decodeEntities: true },
	);
	parser.write(html);
	parser.end();
	return result;
};

/**
 * jmlNode2Html takes a single node in a JSON-ML tree and converts it to an HTML
 * string.
 *
 * @param node - the node to be converted
 * @returns an HTML string
 */
const jmlNode2Html = (node: JsonMLNode) => {
	if (typeof node === "string") {
		return escapeHTML(node);
	} else if (Array.isArray(node)) {
		const tag = node.shift();
		let attributes = <JsonMLAttributes>{};
		let tagAttrs = "";
		const content = <any[]>[];
		if (node.length && isAttr(node[0])) {
			attributes = node.shift() as JsonMLAttributes;
		}
		while (node.length) {
			content.push(jmlNode2Html(node.shift() as JsonMLNode));
		}
		for (const a in attributes) {
			tagAttrs +=
				attributes[a] == null
					? ` ${a}`
					: ` ${a}="${escapeHTML(String(attributes[a]), true)}"`;
		}
		// be careful about adding whitespace here for inline elements
		if (tag === "!") {
			return `<!--${content.join("")}-->`;
		} else if (
			Constants.voidTag.has(tag as TagName) ||
			(tag?.indexOf(":") > -1 && !content.length)
		) {
			return `<${tag}${tagAttrs} />`;
		} else {
			return `<${tag}${tagAttrs}>${content.join("")}</${tag}>`;
		}
	}
};

/**
 * jml2html takes a JSON-ML tree and converts it to an HTML string.
 *
 * @param tree - the JSON-ML tree to be converted
 * @returns an HTML string
 */
export const jml2html = (tree: JsonMLRoot) => {
	return tree.map(jmlNode2Html).join("");
};
