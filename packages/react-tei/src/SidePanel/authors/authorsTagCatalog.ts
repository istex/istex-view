import type { ComponentType } from "react";
import { NoOp } from "../../tags/NoOp";
import { Nothing } from "../../tags/Nothing";
import type { ComponentProps } from "../../tags/type";
import { Name } from "./Name";
import { PersName } from "./PersName";
import { PersNamePart } from "./PersNamePart";

export const authorTagCatalogs: Record<
	string,
	ComponentType<ComponentProps>
> = {
	persName: PersName,
	forename: PersNamePart,
	surname: PersNamePart,
	roleName: PersNamePart,
	addName: PersNamePart,
	genName: PersNamePart,
	nameLink: PersNamePart,
	orgName: PersNamePart,
	name: Name,
	affiliation: Nothing,
	"#text": NoOp,
};
