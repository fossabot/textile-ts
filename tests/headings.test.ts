import { describe, it, snapshot } from "node:test";
import path from "node:path";
import Textile from "../src/index.js";

// snapshot dir path
snapshot.setResolveSnapshotPath((testPath) => {
  const _dir = path.dirname(testPath as string);
  const _baseName = path.basename(testPath as string);
  return path.join(_dir, "__snapshots__", `${_baseName}.snapshot`);
});

describe("Heading Tests", () => {
  const textile = new Textile();
  it("Normal Heading", async (t) => {
    await t.test("h1", (t) => {
      const input = "h1. Header 1";
      const result = textile.parse(input);
      const excepted = "<h1>Header 1</h1>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h2", (t) => {
      const input = "h2. Header 2";
      const result = textile.parse(input);
      const excepted = "<h2>Header 2</h2>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h3", (t) => {
      const input = "h3. Header 3";
      const result = textile.parse(input);
      const excepted = "<h3>Header 3</h3>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h4", (t) => {
      const input = "h4. Header 4";
      const result = textile.parse(input);
      const excepted = "<h4>Header 4</h4>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h5", (t) => {
      const input = "h5. Header 5";
      const result = textile.parse(input);
      const excepted = "<h5>Header 5</h5>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h6", (t) => {
      const input = "h6. Header 6";
      const result = textile.parse(input);
      const excepted = "<h6>Header 6</h6>";
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
  //==
  it("Heading with class,id and styles", async (t) => {
    await t.test("h1 with class", (t) => {
      const input = "h1(foo bar-biz). Header 1";
      const result = textile.parse(input);
      const excepted = '<h1 class="foo bar-biz">Header 1</h1>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h2 with id", (t) => {
      const input = "h2(#foo). Header 2";
      const result = textile.parse(input);
      const excepted = '<h2 id="foo">Header 2</h2>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h3 with styles", (t) => {
      const input = "h3{color:red;}. Header 3";
      const result = textile.parse(input);
      const excepted = '<h3 style="color:red;">Header 3</h3>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h4 with class and id", (t) => {
      const input = "h4(foo bar #biz). Header 4";
      const result = textile.parse(input);
      const excepted = '<h4 class="foo bar" id="biz">Header 4</h4>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h5 with lang", (t) => {
      const input = "h5[en]. Header 5";
      const result = textile.parse(input);
      const excepted = '<h5 lang="en">Header 5</h5>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h6 with class,id,lang and styles", (t) => {
      const input = "h6(foo #bar){color:red;}[en]. Header 6";
      const result = textile.parse(input);
      const excepted = '<h6 class="foo" id="bar" lang="en" style="color:red;">Header 6</h6>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
  // ====
  it("Headings can be aligned left, right or centered", async (t) => {
    await t.test("h1 Left aligned", (t) => {
      const input = "h1<. Header 1";
      const result = textile.parse(input);
      const excepted = '<h1 style="text-align:left;">Header 1</h1>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h2 Right aligned", (t) => {
      const input = "h2>. Header 2";
      const result = textile.parse(input);
      const excepted = '<h2 style="text-align:right;">Header 2</h2>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
    await t.test("h3 Centered", (t) => {
      const input = "h3=. Header 3";
      const result = textile.parse(input);
      const excepted = '<h3 style="text-align:center;">Header 3</h3>';
      t.assert.equal(result, excepted);
      t.assert.snapshot({ input, excepted, result });
    });
  });
  // ===
});
