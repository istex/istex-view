import type { ComponentType } from "react";

import { Div } from "./Div.js";
import { Head } from "./Head.js";
import { Hi } from "./Hi.js";
import { NoOp } from "./NoOp.js";
import { P } from "./P.js";
import { Ref } from "./Ref.js";
import { Table } from "./Table.js";
import type { ComponentProps } from "./type.js";

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
};
