import { blockCode } from "./blockCode.js";

export const preProcessedString = (str: string) => {
  let tree = blockCode(str).newLines.filter(
    (i) => i !== "..bc" && i !== "%bc%"
  );
  return tree.join("\n");
};
