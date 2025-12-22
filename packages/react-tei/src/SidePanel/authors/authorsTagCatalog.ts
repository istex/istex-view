import type { ComponentType } from "react";
import { NoOp } from "../../tags/NoOp.js";
import { Nothing } from "../../tags/Nothing.js";
import type { ComponentProps } from "../../tags/type.js";
import { Name } from "./Name.js";
import { PersName } from "./PersName.js";
import { PersNamePart } from "./PersNamePart.js";

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
