import { NoOp } from "../../tags/NoOp";
import { P } from "../../tags/P";
import { Label } from "./Label";
import { Note } from "./Note";

export const footnotesTagCatalog = {
	"#text": NoOp,
	label: Label,
	note: Note,
	p: P,
};
