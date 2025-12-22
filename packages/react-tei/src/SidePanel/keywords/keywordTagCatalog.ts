import { NoOp } from "../../tags/NoOp";
import { Nothing } from "../../tags/Nothing";
import { Keywords } from "./Keywords";
import { Term } from "./Term";

export const keywordTagCatalog = {
	keywords: Keywords,
	term: Term,
	list: NoOp,
	head: Nothing,
	item: NoOp,
	"#text": NoOp,
};
