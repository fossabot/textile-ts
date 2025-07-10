import { describe, it, snapshot } from "node:test";
import path from "node:path";
import Textile from "../src/index.js";

// snapshot dir path
snapshot.setResolveSnapshotPath((testPath) => {
  const _dir = path.dirname(testPath as string);
  const _baseName = path.basename(testPath as string);
  return path.join(_dir, "__snapshots__", `${_baseName}.snapshot`);
});

describe("Code Block Tests", () => {
  const textile = new Textile();
  it("Pre-formatted text", async (t) => {
    await t.test("pre.", (t) => {
      const input = "pre. Pre-formatted       text";
      const result = textile.parse(input);
      const excepted = "<pre>Pre-formatted       text</pre>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("pre.. with empty lines", (t) => {
      const input =
        "pre..\t\nThe first pre-formatted line.\n\t\tAnd another line.";
      const result = textile.parse(input);
      const excepted =
        "<pre>\nThe first pre-formatted line.\n\t\tAnd another line.</pre>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
  it("bc code block", async (t) => {
    await t.test("pre.", (t) => {
      const input = 'bc. 10 PRINT "I ROCK AT BASIC!"\n20 GOTO 10';
      const result = textile.parse(input);
      const excepted =
        '<pre><code>10 PRINT "I ROCK AT BASIC!"\n20 GOTO 10</code></pre>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("Inline snippets of code", (t) => {
      const input = "line with @code@.";
      const result = textile.parse(input);
      const excepted = "<p>line with <code>code</code>.</p>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
});
//==========
describe("Block Quotations Tests", () => {
  const textile = new Textile();
  it("bq.", async (t) => {
    const input = "bq. A block quotation.";
    const result = textile.parse(input);
    const excepted = "<blockquote>\n<p>A block quotation.</p>\n</blockquote>";
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
});
//==
describe("Textile comments", () => {
  const textile = new Textile();
  it("###", async (t) => {
    const input = "###. This is a textile comment block.";
    const result = textile.parse(input);
    const excepted = "";
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
});
//==
describe("No formatting", () => {
  const textile = new Textile();
  it("Override Textile", async (t) => {
    const input =
      'notextile. Straight quotation marks are not converted into curly ones "in this example".';
    const result = textile.parse(input);
    const excepted =
      'Straight quotation marks are not converted into curly ones "in this example".';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
});
