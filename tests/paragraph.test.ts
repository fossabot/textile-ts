import { describe, it, snapshot } from "node:test";
import path from "node:path";
import Textile from "../src/index.js";

// snapshot dir path
snapshot.setResolveSnapshotPath((testPath) => {
  const _dir = path.dirname(testPath as string);
  const _baseName = path.basename(testPath as string);
  return path.join(_dir, "__snapshots__", `${_baseName}.snapshot`);
});

describe("Paragraph Tests", () => {
  const textile = new Textile();
  it("Without using 'p.'", (t) => {
    const input = "A paragraph.";
    const result = textile.parse(input);
    const excepted = "<p>A paragraph.</p>";
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Using 'p.'", (t) => {
    const input = "p. A paragraph.";
    const result = textile.parse(input);
    const excepted = "<p>A paragraph.</p>";
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("And a paragraph with a line break. Without using 'p.'", (t) => {
    const input = "And a paragraph with \n a line break.";
    const result = textile.parse(input);
    const excepted = "<p>And a paragraph with <br>\n a line break.</p>";
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("And a paragraph with a line break. Using 'p.'", (t) => {
    const input = "p. And a paragraph with \n a line break.";
    const result = textile.parse(input);
    const excepted = "<p>And a paragraph with <br>\n a line break.</p>";
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("And a paragraph with a line break,when options.breaks === false", (t) => {
    const tex_tile = new Textile({ breaks: false });
    const input = "p. And a paragraph with \n a line break.";
    const result = tex_tile.parse(input);
    const excepted = "<p>And a paragraph with \n a line break.</p>";
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  // Align
  it("Aligned left paragraph", (t) => {
    const input = "p<. Aligned left paragraph";
    const result = textile.parse(input);
    const excepted = '<p style="text-align:left;">Aligned left paragraph</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Aligned right paragraph.", (t) => {
    const input = "p>. Aligned right paragraph.";
    const result = textile.parse(input);
    const excepted =
      '<p style="text-align:right;">Aligned right paragraph.</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Centered paragraph.", (t) => {
    const input = "p=. Centered paragraph.";
    const result = textile.parse(input);
    const excepted = '<p style="text-align:center;">Centered paragraph.</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Justified paragraph.", (t) => {
    const input = "p<>. Justified paragraph.";
    const result = textile.parse(input);
    const excepted = '<p style="text-align:justify;">Justified paragraph.</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  // Indent '(' for left 1em , '(((' for left 3em , ')' for right 1em , ')))' for right 3em
  it("Left indent 1em.", (t) => {
    const input = "p(. Left indent 1em.";
    const result = textile.parse(input);
    const excepted = '<p style="padding-left:1em;">Left indent 1em.</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Right indent 1em.", (t) => {
    const input = "p). Right indent 1em.";
    const result = textile.parse(input);
    const excepted = '<p style="padding-right:1em;">Right indent 1em.</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Paragraph with class and id", (t) => {
    const input = "p(foo bar #biz). Paragraph with class and id";
    const result = textile.parse(input);
    const excepted =
      '<p class="foo bar" id="biz">Paragraph with class and id</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Paragraph with style", (t) => {
    const input = "p{color:red;font-size:16px}. Paragraph with style";
    const result = textile.parse(input);
    const excepted =
      '<p style="color:red;font-size:16px;">Paragraph with style</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
  it("Paragraph with language attribute", (t) => {
    const input = "p[fr]. Partir, c'est toujours mourir un peu.";
    const result = textile.parse(input);
    const excepted =
      '<p lang="fr">Partir, c&#8217;est toujours mourir un peu.</p>';
    t.assert.equal(result, excepted);
    t.assert.snapshot({ input, excepted, result });
  });
});
