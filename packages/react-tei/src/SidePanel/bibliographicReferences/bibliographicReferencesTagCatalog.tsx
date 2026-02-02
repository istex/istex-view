import { DateTag } from "../../tags/DateTag";
import { Hi } from "../../tags/Hi";
import { NoOp } from "../../tags/NoOp";
import { Ref } from "../../tags/Ref";
import { mathTagCatalog } from "../../tags/tagCatalog";
import { Bibl } from "./Bibl";
import { BiblStruct } from "./BiblStruct";
import { PersName } from "./PersName";

export const bibliographicReferencesTagCatalog = {
	bibl: Bibl,
	biblStruct: BiblStruct,
	title: NoOp,
	author: NoOp,
	persName: PersName,
	editor: NoOp,
	meeting: NoOp,
	resp: NoOp,
	respStmt: NoOp,
	idno: NoOp,
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
	series: NoOp,
	pubPlace: NoOp,
	note: NoOp,

	...mathTagCatalog,
};
