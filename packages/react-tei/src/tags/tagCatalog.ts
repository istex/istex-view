import type { ComponentType } from "react";
import { DateTag } from "./DateTag";
import { Div } from "./Div";
import { Email } from "./Email";
import { Emph } from "./Emph";
import { Epigraph } from "./Epigraph";
import { Figure } from "./Figure";
import { FloatingText } from "./floatingText/FloatingText";
import { mathTagCatalog } from "./formula/mathTagCatalog";
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
import { Q } from "./Q";
import { Quote } from "./Quote";
import { Ref } from "./Ref";
import { Table } from "./Table";
import { Term } from "./Term";
import { Title } from "./Title";
import type { TagCatalog } from "./tagCatalog.type";
import type { ComponentProps } from "./type";

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
	lb: LB,
	salute: NoOp,
	signed: NoOp,
	gloss: NoOp,
	term: Term,
	name: NoOp,
	span: NoOp,
	surname: NoOp,
	lg: Lg,
	l: L,

	cit: NoOp,
	q: Q,
	epigraph: Epigraph,

	email: Email,

	// tags we ignore
	milestone: Nothing,
	pb: Nothing,
	ptr: Nothing,

	...mathTagCatalog,
};
