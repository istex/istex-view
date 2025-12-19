import { NoOp } from "../../tags/NoOp.js";
import { Nothing } from "../../tags/Nothing.js";
import { Keywords } from "./Keywords.js";
import { Term } from "./Term.js";

export const keywordTagCatalog = {
	keywords: Keywords,
	term: Term,
	list: NoOp,
	head: Nothing,
	item: NoOp,
};
