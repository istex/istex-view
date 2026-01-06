import { Hi } from "../../tags/Hi";
import { NoOp } from "../../tags/NoOp";
import { Bibl } from "./Bibl";
import { BiblStruct } from "./BiblStruct";
import { DateTag } from "./DateTag";

export const bibliographicReferencesTagCatalog = {
	bibl: Bibl,
	biblStruct: BiblStruct,
	title: NoOp,
	author: NoOp,
	persName: NoOp,
	forename: NoOp,
	surname: NoOp,
	roleName: NoOp,
	addName: NoOp,
	genName: NoOp,
	nameLink: NoOp,
	orgName: NoOp,
	date: DateTag,
	biblScope: NoOp,
	publisher: NoOp,
	hi: Hi,
	"#text": NoOp,
	name: NoOp,
};
