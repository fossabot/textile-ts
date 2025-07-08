import type { JsonMLNode, JsonMLNodes } from "./shares/types.js";

export default function fixLinks(
	ml: JsonMLNode | JsonMLNodes,
	dict: { [x: string]: any },
) {
	if (Array.isArray(ml)) {
		if (ml[0] === "a") {
			// found a link
			const attr = ml[1];
			if (
				typeof attr === "object" &&
				"href" in attr &&
				(attr.href as string) in dict
			) {
				attr.href = dict[attr.href as string];
			}
		}
		for (let i = 0, l = ml.length; i < l; i++) {
			if (Array.isArray(ml[i])) {
				fixLinks(ml[i] as JsonMLNode, dict);
			}
		}
	}
	return ml;
}
