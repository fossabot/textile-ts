---
title: Paragraphs
group: Documents
category: Syntax Guides
---

# Paragraphs

Paragraphs are separated by blank lines. Each paragraph of text is transformed into a HTML `<p> ... </p>` paragraph block.
Line breaks within paragraphs are transformed into (X)HTML line breaks `<br />`.

**Normal Paragraph**

- `A paragraph.` transformed into `<p>A paragraph.</p>` without using `p.`

- `p. A paragraph.` also transformed into `<p>A paragraph.</p>` using `p.`


**Paragraph with a line break.**



```text
A paragraph with
a line break.
```
Transformed into:

```html
<p>A paragraph with<br>
a line break.</p>
```
