// cSpell:disable
import fs from "node:fs";
import {
  stateABlockNodes,
  type StateABlockNode,
} from "./src/dev/state-a/index.js";
import { stateAAttributes } from "./src/dev/state-a/attributes.js";
import { StateARegexp } from "./src/dev/state-a/regexp.js";
import safe from "safe-regex";
const tx = fs.readFileSync("a.textile", "utf8");
const tree = stateABlockNodes(tx);

const line = '"(classname)link text(title tooltip)":mailto:someone@example.com';

const link =
  /^"(?!\s)((?:[^"]|"(?![\s:])[^\n"]+"(?!:))+)":((?:[^\s()]|\([^\s()]+\)|[()])+?)(?=[!-\.:-@\[\\\]-`{-~]+(?:$|\s)|$|\s)/;
const fenced = /^\["([^\n]+?)":((?:\[[a-z0-9]*\]|[^\]])+)\]/;
const title = /\s*\(((?:\([^()]*\)|[^()])+)\)$/;

const linkGroup = tree.filter(
  (node) =>
    node.type === "text" &&
    (StateARegexp.links.link.test(node.dataString as string) ||
      StateARegexp.links.fenced.test(node.dataString as string))
);
if (linkGroup && linkGroup.length) {
  for (const link of linkGroup) {
    const { type, ...rest } = link;
    const newLink = {
      type: "anchorTag",
      ...rest,
    } as StateABlockNode;
    tree.splice(link.lineIndex, 1, newLink);
  }
}

fs.writeFileSync("bb.json", JSON.stringify(tree, null, 2));
//console.log(txxx);
