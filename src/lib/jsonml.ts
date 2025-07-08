import type { JsonMLNodes } from "./shares/types.js";

// drop or add tab levels to JsonML tree
export function reIndent(ml: any[], shiftBy: any): JsonMLNodes {
	// a bit obsessive, but there we are...
	if (!shiftBy) {
		return ml;
	}
	return ml.map((s) => {
		if (/^\n\t+/.test(s)) {
			if (shiftBy < 0) {
				s = s.slice(0, shiftBy);
			} else {
				for (let i = 0; i < shiftBy; i++) {
					s += "\t";
				}
			}
		} else if (Array.isArray(s)) {
			return reIndent(s, shiftBy);
		}
		return s;
	});
}
