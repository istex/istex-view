import type { ComponentType } from "react";
import { Div } from "./Div";
import { Emph } from "./Emph";
import { Head } from "./Head";
import { Hi } from "./Hi";
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
	sc: NoOp,
	// Structure tags
	body: NoOp,
	"#text": NoOp,
	title: Title,
};
