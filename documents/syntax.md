---
title: Textile Syntax
group: Documents
category: Syntax Guides
children:
    - ./block.md
    - ./lists.md
    - ./links.md
    - ./tables.md
    - ./phrase.md
    - ./attributes.md
---

# Overview of the Textile syntax

### Block formatting

Textile processes text in units of blocks of text, which are separated by a blank line. Paragraphs are the default block type, therefore `<p>…</p>` tags are added to plain text blocks. In order to identify special types of text blocks, a block signature is used. Block signatures are one to three characters terminated by a period, and are placed at the beginning of a text block.

They include:

- `p.` a paragraph (default)
- `h1. – h6.` a heading from level 1 to 6
- `pre.` pre-formatted text
- `bc.` a block of lines of code
- `bq.` a quotation block
- `###.` a comment block
- `notextile.` no formatting (override Textile)

Extended blocks (with empty lines), are marked by two periods, e.g. `bc..` or `bq..` and are terminated with any other text block signature—usually `p.`—to start a normal paragraph.

### Formatting modifiers

Some block signatures accept formatting modifiers, also for CSS or language specification.

They include:

- `(` adds 1em of padding to the left for each `(` character used
- `)` adds 1em of padding to the right for each `)` character used
- `<` aligns to the left (floats to left for tables if combined with the `)` modifier)
- `>` aligns to the right (floats to right for tables if combined with the `(` modifier)
- `=` aligns to center ( sets left, right margins to `auto` for tables )
- `<>`justifies text alignment
- `{style rule}` a CSS style rule
- `[language]` a language identifier (for a `lang` attribute)
- `(class)` or `(#id)` or `(class#id)` for CSS `class` and/or `id` attributes

The formatting modifiers can be combined. For example in order to right align a paragraph and set it in small type you would write:

```textile
p>{font-size:0.8em}. This is the documentation for Textile markup language.
```

### Inline formatting

Within a text block, any portion of the text can be modified by inline formatting signatures.

They include:

- `*strong*` translates into `<strong>strong</strong>`
- `_emphasis_` translates into `<em>emphasis</em>`
- `**bold**` translates into `<b>bold</b>`
- `__italics__` translates into `<i>italics</i>`
- `-deleted text-` translates into `<del>deleted text</del>`
- `+inserted text+` translates into `<ins>inserted text</ins>`
- `^superscript^` translates into `<sup>superscript </sup>`
- `~subscript~` translates into `<sub>subscript</sub>`
- `??citation??` translates into `<cite>citation</cite>`
- `%span%` translates into `<span>span</span>`
- `@code@` translates into `<code>code</code>`

### Automatic conversions

Some text elements, like special characters or apostrophes, are automatically converted to their HTML or unicode equivalent.

They include:

- `"quotation marks"` translate into curly “quotation marks” `&#8220;` and `&#8221;`
- `'Apostrophes'` translate into curly ‘Apostrophes’ `&#8216;` and `&#8217;`
- `Ampersand (&amp;)` automatically escaped into `&amp;`
- `Angle brackets (&lt; or &gt;)` automatically escaped into `&lt;` or `&gt;`
- `A hyphen between whitespaces ( - )` translates into a short dash (–) `&#8211;`
- `Double hyphens ( -- )` translates into a long dash (—) `&#8212;`
- `The lowercase letter x` translates into a dimension sign (×) when placed between numbers `&#215;`
- `Three periods (...)` translates into an ellipsis character (…) `&#8230;`

Special symbols can be created easily by the letters in parentheses or square brackets.

They include:

- `(tm)` trademark: ™
- `(R)` registered: ®
- `(C)` copyright: ©
- `(1/4)` one quarter: ¼
- `(1/2)` one half: ½
- `(3/4)` three quarters: ¾
- `(o)` degree: °
- `(+/-)` plus/minus: ±

### Lists

Different kinds of lists are supported, and can be mixed together.

```text

* A bulleted
* list example

# A numbered
# list example

- A definition list item := An example definition

```
