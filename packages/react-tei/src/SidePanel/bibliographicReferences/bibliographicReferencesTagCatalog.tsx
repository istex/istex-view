import { Hi } from "../../tags/Hi";
import { NoOp } from "../../tags/NoOp";
import { Ref } from "../../tags/Ref";
import { Bibl } from "./Bibl";
import { BiblStruct } from "./BiblStruct";
import { DateTag } from "./DateTag";
import { PersName } from "./PersName";

export const bibliographicReferencesTagCatalog = {
	bibl: Bibl,
	biblStruct: BiblStruct,
	title: NoOp,
	author: NoOp,
	persName: PersName,
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
	ref: Ref,
};
