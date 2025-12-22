import type { ComponentType } from "react";
import { Div } from "./Div";
import { Head } from "./Head";
import { Hi } from "./Hi";
import { NoOp } from "./NoOp";
import { P } from "./P";
import { Ref } from "./Ref";
import { Table } from "./Table";
import type { ComponentProps } from "./type";

export const tagCatalog: Record<string, ComponentType<ComponentProps>> = {
	// Content
	div: Div,
	p: P,
	hi: Hi,
	head: Head,
	table: Table,
	ref: Ref,
	sc: NoOp,
	// Structure tags
	body: NoOp,
	"#text": NoOp,
	title: NoOp,
};
