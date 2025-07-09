const Constants = {
  singletons: {
    area: 1,
    base: 1,
    br: 1,
    col: 1,
    embed: 1,
    hr: 1,
    img: 1,
    input: 1,
    link: 1,
    meta: 1,
    option: 1,
    param: 1,
    wbr: 1,
  },
  pbaAlignLookup: {
    "<": "left",
    "=": "center",
    ">": "right",
    "<>": "justify",
  },
  pbaVAlignLookup: {
    "~": "bottom",
    "^": "top",
    "-": "middle",
  },
  phraseConvert: {
    "*": "strong",
    "**": "b",
    "??": "cite",
    _: "em",
    __: "i",
    "-": "del",
    "%": "span",
    "+": "ins",
    "~": "sub",
    "^": "sup",
    "@": "code",
  },
  charToTag: {
    "^": "thead",
    "~": "tfoot",
    "-": "tbody",
  },
};

export default Constants;
