import type { ComponentType } from "react";

import { Div } from "./Div.js";
import { Head } from "./Head.js";
import { Hi } from "./Hi.js";
import { Name } from "./Name.js";
import { NoOp } from "./NoOp.js";
import { Nothing } from "./Nothing.js";
import { P } from "./P.js";
import { PersName } from "./PersName.js";
import { PersNamePart } from "./PersNamePart.js";
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
	// author tags
	name: Name,
	persName: PersName,
	forename: PersNamePart,
	surname: PersNamePart,
	roleName: PersNamePart,
	addName: PersNamePart,
	genName: PersNamePart,
	nameLink: PersNamePart,
	orgName: PersNamePart,
	affiliation: Nothing,

	// Structure tags
	body: NoOp,
	"#text": NoOp,
};
