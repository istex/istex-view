import type { ComponentType } from "react";
import { DateTag } from "./DateTag";
import { Div } from "./Div";
import { Email } from "./Email";
import { Emph } from "./Emph";
import { Figure } from "./Figure";
import { Formula } from "./Formula";
import { FloatingText } from "./floatingText/FloatingText";
import { MathMLTag } from "./formula/mathml/MathMLTag";
import { mathMLTagNames } from "./formula/mathml/mathMLTagNames";
import { Graphic } from "./Graphic";
import { Head } from "./Head";
import { Hi } from "./Hi";
import { Highlight } from "./Highlight";
import { L } from "./L";
import { LB } from "./LB";
import { Lg } from "./Lg";
import { List } from "./list/List";
import { NoOp } from "./NoOp";
import { Nothing } from "./Nothing";
import { P } from "./P";
import { Quote } from "./Quote";
import { Ref } from "./Ref";
import { Table } from "./Table";
import { Title } from "./Title";
import type { ComponentProps } from "./type";

export type TagCatalog = Record<string, ComponentType<ComponentProps>>;

export const mathTagCatalog: TagCatalog = {
	graphic: Graphic,
	formula: Formula,
	...mathMLTagNames.reduce(
		(acc, tagName) => {
			acc[tagName] = MathMLTag;
			return acc;
		},
		{} as Record<string, ComponentType<ComponentProps>>,
	),
};

export const tagCatalog: TagCatalog = {
	// Content
	div: Div,
	p: P,
	hi: Hi,
	emph: Emph,
	quote: Quote,
	head: Head,
	table: Table,
	ref: Ref,
	sc: NoOp,
	floatingText: FloatingText,
	// Structure tags
	body: NoOp,
	"#text": NoOp,
	list: List,

	// Enrichment tags, we have specific implementations
	highlightedText: NoOp,
	highlight: Highlight as unknown as ComponentType<ComponentProps>,

	title: Title,
	bibl: NoOp,
	biblScope: NoOp,
	date: DateTag,
	s: NoOp,
	figure: Figure,
	postscript: Div,
	argument: NoOp,
	opener: Div,
	closer: Div,
	dateline: P,
	epigraph: NoOp,
	lb: LB,
	salute: NoOp,
	signed: NoOp,
	gloss: NoOp,
	term: NoOp,
	name: NoOp,
	span: NoOp,
	surname: NoOp,
	lg: Lg,
	l: L,

	email: Email,

	// tags we ignore
	milestone: Nothing,
	pb: Nothing,
	ptr: Nothing,

	...mathTagCatalog,
};
