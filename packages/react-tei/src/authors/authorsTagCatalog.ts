import type { ComponentType } from "react";
import { UrlIdno } from "../SidePanel/bibliographicReferences/UrlIdno";
import { NoOp } from "../tags/NoOp";
import { Nothing } from "../tags/Nothing";
import type { ComponentProps } from "../tags/type";
import { Address } from "./tags/Address";
import { Affiliation } from "./tags/Affiliation";
import { Author } from "./tags/Author";
import { PersName } from "./tags/PersName";
import { PersNamePart } from "./tags/PersNamePart";

export const authorTagCatalogs: Record<
	string,
	ComponentType<ComponentProps>
> = {
	author: Author,
	affiliation: Affiliation,

	address: Address,
	street: NoOp,
	region: NoOp,
	postCode: NoOp,
	postBox: NoOp,
	settlement: NoOp,
	city: NoOp,
	state: NoOp,
	bloc: NoOp,
	district: NoOp,
	addrLine: NoOp,
	country: NoOp,

	"#text": NoOp,
	name: NoOp,

	persName: PersName,
	forename: PersNamePart,
	surname: PersNamePart,
	addName: PersNamePart,
	genName: PersNamePart,
	nameLink: PersNamePart,
	orgName: PersNamePart,

	roleName: Nothing,
	email: Nothing,
	idno: UrlIdno,
};
