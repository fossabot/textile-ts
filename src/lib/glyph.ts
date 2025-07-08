import { regexp } from "./shares/re.js";
import type { JsonMLNode } from "./shares/types.js";
export default function parseGlyph(node: JsonMLNode) {
	if (typeof node !== "string") {
		return node;
	}
	// order is important here ...
	return (
		node
			.replace(regexp.reArrow, "$1&#8594;")
			.replace(regexp.reDimsign, "$1&#215;$2")
			.replace(regexp.reEllipsis, "$1&#8230;")
			.replace(regexp.reEmdash, "$1&#8212;$2")
			.replace(regexp.reEndash, " &#8211; ")
			.replace(regexp.reTrademark, "$1&#8482;")
			.replace(regexp.reRegistered, "$1&#174;")
			.replace(regexp.reCopyright, "$1&#169;")
			// double quotes
			.replace(regexp.reDoublePrime, "$1&#8243;")
			.replace(regexp.reClosingDQuote, "$1&#8221;")
			.replace(regexp.reOpenDQuote, "&#8220;")
			// single quotes
			.replace(regexp.reSinglePrime, "$1&#8242;")
			.replace(regexp.reApostrophe, "$1&#8217;$2")
			.replace(regexp.reClosingSQuote, "$1&#8217;")
			.replace(regexp.reOpenSQuote, "&#8216;")
			// fractions and degrees
			.replace(/[([]1\/4[\])]/, "&#188;")
			.replace(/[([]1\/2[\])]/, "&#189;")
			.replace(/[([]3\/4[\])]/, "&#190;")
			.replace(/[([]o[\])]/, "&#176;")
			.replace(/[([]\+\/-[\])]/, "&#177;")
	);
}
