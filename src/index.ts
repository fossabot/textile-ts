import { html2jml, jml2html } from "./lib/html-jml.js";
import type {
  JsonMLAttributes,
  JsonMLElement,
  JsonMLNode,
  JsonMLNodes,
  JsonMLRoot,
  JsonMLVisitor,
  Options,
  TagName,
} from "./lib/shares/types.js";
import textile2jml from "./lib/textile-jml.js";
import walk from "./lib/walk.js";

class Textile {
  private _opts: Options;
  private _text: string;
  private _html: string;
  private _tree: JsonMLRoot;
  private _visitors: JsonMLVisitor[];
  constructor(options?: Options) {
    this._opts = options ?? { breaks: true };
    this._visitors = [];
    this._text = "";
    this._html = "";
    this._tree = [];
  }
  private _init() {
    if (this._text === "") {
      throw new Error("Error: required raw textile string to convert");
    }
    this._tree = textile2jml(this._text, this._opts);
    if (this._visitors.length > 0) {
      this._visitors.forEach((v) => {
        walk(this._tree, v);
      });
    }
    this._html = jml2html(this._tree);
  }
  public use(...visitors: JsonMLVisitor[]) {
    visitors.forEach((visitor) => {
      this._visitors.push(visitor);
    });
    return this;
  }
  public parse(raw: string) {
    this._text = raw;
    this._init();
    return this._html;
  }
  public htmlToJsonML(text: string): JsonMLRoot {
    return html2jml(text);
  }
}

export type {
  JsonMLNode,
  JsonMLAttributes,
  JsonMLElement,
  JsonMLNodes,
  JsonMLRoot,
  JsonMLVisitor,
  TagName,
};

export default Textile;
