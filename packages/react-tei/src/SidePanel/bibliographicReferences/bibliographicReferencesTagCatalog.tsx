import { NoOp } from "../../tags/NoOp";
import { Bibl } from "./Bibl";
import { DateTag } from "./DateTag";

export const bibliographicReferencesTagCatalog = {
	bibl: Bibl,
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
	"#text": NoOp,
};
