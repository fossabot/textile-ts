export interface Options {
	breaks?: boolean;
}
export interface _Options extends Options {
	_lst?: any;
}
export type TokenType = "OPEN" | "CLOSE" | "SINGLE" | "TEXT" | "COMMENT" | "WS";
export type Token =
	| CommentToken
	| TextToken
	| WsToken
	| CloseToken
	| OpenToken
	| SingleToken;
export interface CommentToken {
	type: "COMMENT";
	data: string;
	pos: number;
	src: string;
}
export interface TextToken {
	type: "TEXT";
	data: string;
	pos: number;
	src: string;
}
export interface WsToken {
	type: "WS";
	data: string;
	pos: number;
	src: string;
}
export interface CloseToken {
	type: "CLOSE";
	tag: TagName;
	pos: number;
	src: string;
}
export interface OpenToken {
	type: "OPEN";
	tag: TagName;
	pos: number;
	src: string;
	attr?: JsonMLAttributes;
}
export interface SingleToken {
	type: "SINGLE";
	tag: TagName;
	pos: number;
	src: string;
	attr?: JsonMLAttributes;
}
// --------------------
export interface JsonMLAttributes {
	[key: string]: any;
	style?: string;
	lang?: string;
	href?: string;
	title?: string;
	alt?: string;
	src?: string;
	colspan?: string;
	rowspan?: string;
	class?: string;
	id?: string;
}
export type JsonMLElement =
	| [TagName, JsonMLAttributes | string | JsonMLElement]
	| [TagName, JsonMLAttributes | string | JsonMLElement, string]
	| [TagName, JsonMLAttributes | string | JsonMLElement, ...JsonMLElement[]]
	| [TagName, ...JsonMLElement[]];
export type JsonMLNode = string | JsonMLElement;
export type JsonMLNodes = Array<string | JsonMLElement>;
export type JsonMLRoot = [...JsonMLNodes];
export type TagName =
	| "a"
	| "abbr"
	| "address"
	| "area"
	| "article"
	| "aside"
	| "audio"
	| "b"
	| "bdi"
	| "bdo"
	| "blockquote"
	| "body"
	| "br"
	| "button"
	| "canvas"
	| "caption"
	| "cite"
	| "code"
	| "col"
	| "colgroup"
	| "data"
	| "datalist"
	| "dd"
	| "del"
	| "details"
	| "dfn"
	| "dialog"
	| "div"
	| "dl"
	| "dt"
	| "em"
	| "embed"
	| "fieldset"
	| "figcaption"
	| "figure"
	| "footer"
	| "form"
	| "h1"
	| "h2"
	| "h3"
	| "h4"
	| "h5"
	| "h6"
	| "header"
	| "hgroup"
	| "hr"
	| "i"
	| "iframe"
	| "img"
	| "input"
	| "ins"
	| "kbd"
	| "label"
	| "legend"
	| "li"
	| "main"
	| "map"
	| "mark"
	| "menu"
	| "meter"
	| "nav"
	| "noscript"
	| "object"
	| "ol"
	| "optgroup"
	| "option"
	| "output"
	| "p"
	| "picture"
	| "pre"
	| "progress"
	| "q"
	| "rp"
	| "rt"
	| "ruby"
	| "s"
	| "samp"
	| "search"
	| "section"
	| "select"
	| "slot"
	| "small"
	| "source"
	| "span"
	| "strong"
	| "sub"
	| "summary"
	| "sup"
	| "table"
	| "tbody"
	| "td"
	| "template"
	| "textarea"
	| "tfoot"
	| "th"
	| "thead"
	| "time"
	| "tr"
	| "track"
	| "u"
	| "ul"
	| "var"
	| "video"
	| "wbr"
	| "###"
	| "notextile"
	| "!"
	| "bc"
	| "bq"
	| "script"
	| "style";
