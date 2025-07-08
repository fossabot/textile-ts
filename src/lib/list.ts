import { parseAttr } from "./attr.js";
import { Ribbon } from "./build.js";
import parseInline from "./inline.js";
import merge from "./merge.js";
import { regexp } from "./shares/re.js";
import type { _Options } from "./shares/types.js";

function listPad(n: number) {
	let s = "\n";
	while (n--) {
		s += "\t";
	}
	return s;
}

export default function parseList(src: string, options?: _Options) {
	const ribbon = new Ribbon(src.replace(/(^|\r?\n)[\t ]+/, "$1"));
	const stack: any[] = [];
	const currIndex: { [x: number]: any } = {};
	const lastIndex = options?._lst || {};
	let itemIndex = 0;
	let listAttr: any = null;
	let m: RegExpExecArray | null = null;
	let n: RegExpExecArray | null = null;
	let s: any = { ul: [] }; // Initialize s with a default structure
	while ((m = regexp.reItem.exec(src))) {
		const item = ["li"];
		const destLevel = m[1].length;
		const type = m[1].slice(-1) === "#" ? "ol" : "ul";
		let newLi = null;
		let lst;
		let par;
		let pba;
		let r;
		// list starts and continuations
		if ((n = /^(_|\d+)/.exec(m[2]))) {
			itemIndex = Number.isFinite(parseInt(n[1]))
				? parseInt(n[1], 10)
				: lastIndex[destLevel] || currIndex[destLevel] || 1;
			m[2] = m[2].slice(n[1].length);
		}

		if ((pba = parseAttr(m[2], "li"))) {
			m[2] = m[2].slice(pba[0] as any);
			pba = pba[1];
		}

		// list control
		if (/^\.\s*$/.test(m[2])) {
			listAttr = pba || {};
			ribbon.advance(m[0]);
			src = ribbon.toString();
			continue;
		}
		// create nesting until we have correct level
		while (stack.length < destLevel) {
			// list always has an attribute object, this simplifies first-pba resolution
			lst = [type, {}, listPad(stack.length + 1), (newLi = ["li"])];
			par = stack[stack.length - 1];
			if (par) {
				par.li.push(listPad(stack.length));
				par.li.push(lst);
			}
			stack.push({
				ul: lst,
				li: newLi,
				// count attributes's found per list
				att: 0,
			});
			currIndex[stack.length] = 1;
		}
		// remove nesting until we have correct level
		while (stack.length > destLevel) {
			r = stack.pop();
			r.ul.push(listPad(stack.length));
			// lists have a predictable structure - move pba from listitem to list
			if (r.att === 1 && !r.ul[3][1].substr) {
				merge(r.ul[1], r.ul[3].splice(1, 1)[0]);
			}
		}
		// parent list
		par = stack[stack.length - 1];

		if (itemIndex) {
			par.ul[1].start = itemIndex;
			currIndex[destLevel] = itemIndex;
			// falsy prevents this from fireing until it is set again
			itemIndex = 0;
		}
		if (listAttr) {
			// "more than 1" prevent attribute transfers on list close
			par.att = 9;
			merge(par.ul[1], listAttr as any);
			listAttr = null;
		}

		if (!newLi) {
			par.ul.push(listPad(stack.length), item);
			par.li = item;
		}
		if (pba) {
			par.li.push(pba);
			par.att++;
		}
		Array.prototype.push.apply(par.li, parseInline(m[2].trim(), options));

		ribbon.advance(m[0]);
		src = ribbon.toString();
		currIndex[destLevel] = (currIndex[destLevel] || 0) + 1;
	}
	// ===
	// remember indexes for continuations next time
	if (options?._lst) {
		options._lst = currIndex;
	}

	while (stack.length) {
		s = stack.pop();
		s.ul.push(listPad(stack.length));
		// lists have a predictable structure - move pba from listitem to list
		if (s.att === 1 && !s.ul[3][1].substr) {
			merge(s.ul[1], s.ul[3].splice(1, 1)[0]);
		}
	}

	return s.ul;
}
