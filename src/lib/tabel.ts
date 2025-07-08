import { parseAttr } from "./attr.js";
import { Ribbon } from "./build.js";
import parseInline from "./inline.js";
import { reIndent } from "./jsonml.js";
import merge from "./merge.js";
import { regexp } from "./shares/re.js";
import type { Options, TagName } from "./shares/types.js";

const charToTag = {
	"^": "thead",
	"~": "tfoot",
	"-": "tbody",
};

export function parseColgroup(src: string) {
	const colgroup = ["colgroup", {}];
	src.split("|").forEach((s, isCol) => {
		const col: Record<string, any> = isCol ? {} : colgroup[1];
		let d = s.trim();
		let m;
		if (d) {
			if ((m = /^\\(\d+)/.exec(d))) {
				col.span = +m[1];
				d = d.slice(m[0].length);
			}
			if ((m = parseAttr(d, "col"))) {
				merge(col, m[1] as Record<string, any>);
				d = d.slice(m[0] as any);
			}
			if ((m = /\b\d+\b/.exec(d))) {
				col.width = +m[0];
			}
		}
		if (isCol) {
			colgroup.push("\n\t\t", ["col", col]);
		}
	});
	return colgroup.concat(["\n\t"]);
}

export function parseTable(src: string, options?: Options) {
	const ribbon = new Ribbon(src.trim());
	const rowgroups: any[] = [];
	let colgroup;
	let caption;
	const tAttr: Record<string, any> = {};
	let tCurr;
	let row;
	let inner;
	let pba;
	let more;
	let m: RegExpExecArray | null = null;
	let extended = 0;
	const setRowGroup = (type: any, pba?: any) => {
		tCurr = [type, pba || {}];
		rowgroups.push(tCurr);
	};
	if ((m = regexp.reHead.exec(src))) {
		// parse and apply table attr
		ribbon.advance(m[0]);
		src = ribbon.toString();
		pba = parseAttr(m[2], "table");
		if (pba) {
			merge(tAttr, pba[1] as any);
		}
		if (m[3]) {
			tAttr.summary = m[3];
		}
	}
	// ===
	// caption
	if ((m = regexp.reCaption.exec(src))) {
		caption = ["caption"];
		if ((pba = parseAttr(m[1], "caption"))) {
			caption.push(pba[1] as any);
			m[1] = m[1].slice(pba[0] as any);
		}
		if (/\./.test(m[1])) {
			// mandatory "."
			caption.push(
				m[1]
					.slice(1)
					.replace(/\|\s*$/, "")
					.trim(),
			);
			extended++;
			ribbon.advance(m[0]);
			src = ribbon.toString();
		} else {
			caption = null;
		}
	}
	// ==
	do {
		// colgroup
		if ((m = regexp.reColgroup.exec(src))) {
			colgroup = parseColgroup(m[1]);
			extended++;
		}
		// "rowgroup" (tbody, thead, tfoot)
		else if ((m = regexp.reRowgroup.exec(src))) {
			// PHP allows any amount of these in any order
			// and simply translates them straight through
			// the same is done here.
			const tag = charToTag[m[1] as keyof typeof charToTag] || "tbody";
			pba = parseAttr(`${m[2]} `, tag as TagName);
			setRowGroup(tag, pba?.[1]);
			extended++;
		}
		// row
		else if ((m = regexp.reRow.exec(src))) {
			if (!tCurr) {
				setRowGroup("tbody");
			}

			row = ["tr"];

			if (m[2] && (pba = parseAttr(m[2], "tr"))) {
				// FIXME: requires "\.\s?" -- else what ?
				row.push(pba[1] as any);
			}

			(tCurr as any).push("\n\t\t", row);
			inner = new Ribbon(m[3]);

			do {
				inner.save();
				m[3] = inner.toString();

				// cell loop
				const th = inner.startsWith("_");
				let cell = [th ? "th" : "td"];
				if (th) {
					inner.advance(1);
				}

				pba = parseAttr(m[3], "td");
				if (pba) {
					inner.advance(pba[0] as any);
					m[3] = inner.toString();
					cell.push(pba[1] as any); // FIXME: don't do this if next text fails
				}

				if (pba || th) {
					const p = /^\.\s*/.exec(m[3]);
					if (p) {
						inner.advance(p[0]);
					} else {
						cell = ["td"];
						inner.load();
					}
				}

				const mx = /^(==.*?==|[^|])*/.exec(m[3]);

				if (mx) {
					cell = cell.concat(parseInline(mx[0], options) as any);
					row.push("\n\t\t\t", cell as any);
					more = inner.valueOf().charAt(mx[0].length) === "|";
					inner.advance(mx[0].length + 1);
				}
			} while (more);

			row.push("\n\t\t");
		}
		//
		if (m) {
			ribbon.advance(m[0]);
			src = ribbon.toString();
		}
	} while (m);
	// assemble table
	let table = ["table", tAttr];
	if (extended) {
		if (caption) {
			table.push("\n\t", caption);
		}
		if (colgroup) {
			table.push("\n\t", colgroup);
		}
		rowgroups.forEach((tbody) => {
			table.push("\n\t", tbody.concat(["\n\t"]));
		});
	} else {
		table = table.concat(reIndent(rowgroups[0].slice(2), -1));
	}

	table.push("\n");
	return table;
}
