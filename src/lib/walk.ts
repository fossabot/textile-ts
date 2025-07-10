import { is_element, has_child } from "./shares/helpers.js";
import type {
  JsonMLNode,
  JsonMLNodes,
  JsonMLVisitor,
  JsonMLRoot,
  JsonMLElement,
} from "./shares/types.js";

export default function walk(tree: JsonMLRoot, visitor: JsonMLVisitor) {
  const traverse = (node: JsonMLNode) => {
    const idx = tree.indexOf(node);
    if (typeof node === "string" && visitor.visitText) {
      visitor.visitText(node, idx, tree);
    }
    if (
      typeof node !== "string" &&
      Array.isArray(node) &&
      is_element(node) &&
      visitor.visitElement
    ) {
      visitor.visitElement(node, idx, tree);
      if (has_child(node)) {
        const childs = node.filter((n) => is_element(n as JsonMLNode));
        childs.forEach((child) => {
          const _idx = childs.indexOf(child);
          if (visitor.visitElement) {
            visitor.visitElement(
              child as JsonMLElement,
              _idx,
              childs as JsonMLNodes
            );
          }
        });
      }
    }
  };
  tree.forEach(traverse);
}
