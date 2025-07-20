import fs from "node:fs";
import textile2jml from "./src/lib/jsonml/index.js";
import { preProcessedString } from "./src/lib/pre-process/index.js";
import { ml2hast, hast2html } from "./src/lib/hast/hast.js";
//
const tx = fs.readFileSync("b.textile", "utf8");
const txt = preProcessedString(tx);
const jsonMl = textile2jml(txt);
const hast = ml2hast(jsonMl);
const html = hast2html(hast);

//fs.writeFileSync("aa.json", JSON.stringify(hast, null, 2));
fs.writeFileSync("aa.html", html);
