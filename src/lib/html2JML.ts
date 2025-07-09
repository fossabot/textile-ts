import * as htmlparser2 from "htmlparser2";
import type {
  JsonMLRoot,
  JsonMLNodes,
  JsonMLElement,
  TagName,
} from "./shares/types.js";

const html2JML = (html: string) => {
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
    { decodeEntities: true }
  );
  parser.write(html);
  parser.end();
  return result;
};
export default html2JML;
