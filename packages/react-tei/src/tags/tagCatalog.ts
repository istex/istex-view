import type { ComponentType } from "react";
import { DateTag } from "./DateTag";
import { Div } from "./Div";
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
import { NoOp } from "./NoOp";
import { P } from "./P";
import { Quote } from "./Quote";
import { Ref } from "./Ref";
import { Table } from "./Table";
import { Title } from "./Title";
import type { ComponentProps } from "./type";

export const tagCatalog: Record<string, ComponentType<ComponentProps>> = {
	// Content
	div: Div,
	p: P,
	hi: Hi,
	emph: Emph,
	quote: Quote,
	head: Head,
	table: Table,
	ref: Ref,
	graphic: Graphic,
	sc: NoOp,
	floatingText: FloatingText,
	// Structure tags
	body: NoOp,
	"#text": NoOp,

	// Enrichment tags, we have specific implementations
	highlightedText: NoOp,
	highlight: Highlight as unknown as ComponentType<ComponentProps>,

	title: Title,
	bibl: NoOp,
	biblScope: NoOp,
	date: DateTag,
	s: NoOp,
	figure: Figure,
	formula: Formula,

	...mathMLTagNames.reduce(
		(acc, tagName) => {
			acc[tagName] = MathMLTag;
			return acc;
		},
		{} as Record<string, ComponentType<ComponentProps>>,
	),
};
