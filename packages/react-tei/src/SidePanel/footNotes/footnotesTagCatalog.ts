import { Emph } from "../../tags/Emph";
import { mathTagCatalog } from "../../tags/formula/mathTagCatalog";
import { Hi } from "../../tags/Hi";
import { L } from "../../tags/L";
import { Lg } from "../../tags/Lg";
import { NoOp } from "../../tags/NoOp";
import { P } from "../../tags/P";
import { Quote } from "../../tags/Quote";
import { Ref } from "../../tags/Ref";
import { Note } from "./Note";

export const footnotesTagCatalog = {
	"#text": NoOp,
	note: Note,
	p: P,
	hi: Hi,
	emph: Emph,
	quote: Quote,
	lg: Lg,
	l: L,
	ref: Ref,

	...mathTagCatalog,
};
