import type { ComponentType } from "react";
import { Div } from "../Div";
import { Hi } from "../Hi";
import { Highlight } from "../Highlight";
import { NoOp } from "../NoOp";
import { P } from "../P";
import { Ref } from "../Ref";
import { Table } from "../Table";
import type { ComponentProps } from "../type";
import { FigDesc } from "./FigDesc";
import { Head } from "./Head";
import { S } from "./S";

export const figureTagCatalog: Record<string, ComponentType<ComponentProps>> = {
	head: Head,
	label: Head,
	figDesc: FigDesc,
	caption: FigDesc,
	desc: FigDesc,
	note: NoOp,
	p: P,
	div: Div,
	ref: Ref,
	hi: Hi,
	"#text": NoOp,
	highlightedText: NoOp,
	s: S,
	highlight: Highlight as unknown as ComponentType<ComponentProps>,
	table: Table,
};
