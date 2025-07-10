import { html2jml } from "./lib/html-jml.js";
import { isCodeBlock } from "./lib/shares/helpers.js";
import type {
  HighlightFunction,
  JsonMLAttributes,
  JsonMLElement,
  JsonMLVisitor,
} from "./lib/shares/types.js";

const highlightVisitor = (
  highlighter: "highlightjs" | "shiki",
  highlightFunction: HighlightFunction
): JsonMLVisitor => {
  return {
    visitElement(node) {
      if (isCodeBlock(node) && Array.isArray(node) && node.length === 3) {
        const c = node[2] as JsonMLElement;
        const code = c[2] as string;
        const lang = (c[1] as JsonMLAttributes).class
          ?.split(" ")
          .find((i) => i.startsWith("language-"))
          ?.split("-")[1] as string;
        const hc = html2jml(highlightFunction(code, lang));
        switch (highlighter) {
          case "highlightjs":
            c.splice(2, 1, hc);
            break;
          case "shiki":
            node.splice(1, 1, hc[0][1]);
            node.splice(2, 1, hc[0][2]);
        }
      }
    },
  };
};

export default highlightVisitor;
