import { StateARegexp } from "./regexp.js";
export interface StateAAttributes {
  className?: string[];
  styles?: string[];
  lang?: string;
  id?: string;
  href?: string;
  title?: string;
}

const stateAAlignAttrMap = {
  "<": "text-align: left",
  ">": "text-align: right",
  "=": "text-align: center",
  "<>": "text-align: justify",
  "^": "vertical-align: top",
  "-": "vertical-align: middle",
  "~": "vertical-align: bottom",
};

const stateAAttributes = (str: string) => {
  if (str === "") return {};
  let obj: StateAAttributes = {
    className: [],
    styles: [],
    lang: undefined,
    id: undefined,
  };

  let remain = str;
  let m: RegExpExecArray | null = null;
  do {
    if ((m = StateARegexp.alignRe.exec(remain))) {
      obj.styles!.push(stateAAlignAttrMap[m[1]]);
      remain = remain.slice(m[0].length);
      continue;
    }
    if ((m = StateARegexp.classIdRe.exec(remain))) {
      // split the string by one or more spaces
      const dd = m[1].split(/\s+/);
      if (dd.length) {
        dd.forEach((d) => {
          if (d.startsWith("#")) {
            obj.id = d.slice(1);
          } else if (d.startsWith("*")) {
            obj.className!.push(`language-${d.slice(1)}`);
          } else {
            obj.className!.push(d);
          }
        });
      }
      remain = remain.slice(m[0].length);
      continue;
    }
    if ((m = StateARegexp.styleRe.exec(remain))) {
      const ss = m[1].split(";");
      if (ss.length) {
        ss.forEach((s) => {
          if (StateARegexp.cssRe.test(s)) {
            obj.styles!.push(s);
          }
        });
      }
      remain = remain.slice(m[0].length);
      continue;
    }
    if ((m = StateARegexp.langRe.exec(remain))) {
      obj.lang = m[1];
      remain = remain.slice(m[0].length);
      continue;
    }
  } while (m);
  return obj;
};

export { stateAAttributes, stateAAlignAttrMap };
