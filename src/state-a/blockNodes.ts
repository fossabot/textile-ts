import { stateABlockCode } from "./blockCode.js";
import { stateAAttributes } from "./attributes.js";
import type {BlocksSignature,StateABlockTypes,StateABlockNode} from "./types.js"
export const stateABlocksMap: Record<BlocksSignature, StateABlockTypes> = {
  p: "paragraph",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  pre: "preBlock",
  bc: "codeBlock",
  bq: "blockquote",
  "###": "comment",
  notextile: "override",
};
/** 
 * Regular Expression for Blocks signature of `Textile Syntax`
 * 
 {@see https://regex101.com/r/lWUVsx/3 }
 */
const BlockLevelRegexp: RegExp =
  /^(b[cq]|notextile|pre|h[1-6]|p|###)([^.]*)(\.\.|\.)?\s*(.*)$/m;
/** 
 * Regular Expression for Links Reference of `Textile Syntax`
 * 
 {@see https://regex101.com/r/q05jqR/1 }
 */
const LinkRefRegexp = /^\[([^\]]+)\]((?:https?:\/\/|\/|\.\/)\S+)(?:\s*\n|$)/;

export function stateABlockNodes(input: string): StateABlockNode[] {
  const lines = stateABlockCode(input);
  const createNode = (str: string, idx: number) => {
    const obj: StateABlockNode = {
      lineIndex: idx,
      linkRef: {
        name: "",
        link: "",
      },
    };
    let m: RegExpExecArray | null = null;
    if ((m = BlockLevelRegexp.exec(str))) {
      obj.type = stateABlocksMap[m[1]];
      obj.signature = m[1] as BlocksSignature;
      obj.attributes = stateAAttributes(m[2]);
      obj.dotNotationCount = m[3].length;
      obj.rawSting = m.input;
      if (m[1] === "bc" && m[3].length > 1) {
        obj.dataString = m.input.split(m[3])[1];
      } else {
        obj.dataString = m[4];
      }
    } else if ((m = LinkRefRegexp.exec(str))) {
      obj.type = "linkRef";
      obj.linkRef.name = m[1];
      obj.linkRef.link = m[2];
    } else {
      obj.type = "text";
      obj.rawSting = str;
      obj.dataString = str;
    }
    return obj;
  };
  return lines.map(createNode);
}
