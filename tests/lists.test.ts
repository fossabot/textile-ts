import { describe, it, snapshot } from "node:test";
import path from "node:path";
import Textile from "../src/index.js";

// snapshot dir path
snapshot.setResolveSnapshotPath((testPath) => {
  const _dir = path.dirname(testPath as string);
  const _baseName = path.basename(testPath as string);
  return path.join(_dir, "__snapshots__", `${_baseName}.snapshot`);
});

describe("Lists Tests", () => {
  const textile = new Textile();
  it("Bulleted (unordered) lists", async (t) => {
    await t.test("*", (t) => {
      const input = "* Item A";
      const result = textile.parse(input);
      const excepted = "<ul>\n\t<li>Item A</li>\n</ul>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("* and *", (t) => {
      const input = "* Item A\n* Item B";
      const result = textile.parse(input);
      const excepted = "<ul>\n\t<li>Item A</li>\n\t<li>Item B</li>\n</ul>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("* and **", (t) => {
      const input = "* Item A\n** Item B";
      const result = textile.parse(input);
      const excepted =
        "<ul>\n\t<li>Item A\n\t<ul>\n\t\t<li>Item B</li>\n\t</ul></li>\n</ul>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
  //==
  it("Numbered (ordered) lists", async (t) => {
    await t.test("#", (t) => {
      const input = "# Item A";
      const result = textile.parse(input);
      const excepted = "<ol>\n\t<li>Item A</li>\n</ol>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("# and #", (t) => {
      const input = "# Item A\n# Item B";
      const result = textile.parse(input);
      const excepted = "<ol>\n\t<li>Item A</li>\n\t<li>Item B</li>\n</ol>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("# and ##", (t) => {
      const input = "# Item A\n## Item B";
      const result = textile.parse(input);
      const excepted =
        "<ol>\n\t<li>Item A\n\t<ol>\n\t\t<li>Item B</li>\n\t</ol></li>\n</ol>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
  // ====
  it("Definition lists", async (t) => {
    await t.test(":=", (t) => {
      const input = "- HTML := HyperText Markup Language, based on SGML.";
      const result = textile.parse(input);
      const excepted =
        '<dl>\n\t<dt><span class="caps">HTML</span></dt>\n\t<dd>HyperText Markup Language, based on <span class="caps">SGML</span>.</dd>\n</dl>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test(":= and multi line end with =:", (t) => {
      const input =
        "- HTML := HyperText Markup Language, based on SGML.\n- XHTML := HTML 4.0 rewritten to be compliant with XML rules.=:";
      const result = textile.parse(input);
      const excepted =
        '<dl>\n\t<dt><span class="caps">HTML</span></dt>\n\t<dd>HyperText Markup Language, based on <span class="caps">SGML</span>.</dd>\n\t<dt><span class="caps">XHTML</span></dt>\n\t<dd><p><span class="caps">HTML</span> 4.0 rewritten to be compliant with <span class="caps">XML</span> rules.</p></dd>\n</dl>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
  it("WikiMedia markup style for definition lists", { skip: true }, () => {
    //TODO for implement this
  });
  it("Footnotes", { skip: true }, () => {
    //TODO for implement this
  });
  it("Endnotes", { skip: true }, () => {
    //TODO for implement this
  });
});
