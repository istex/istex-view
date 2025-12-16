import type { ComponentType } from "react";
import type { DocumentJson } from "../parser/document.js";
import { Div } from "./Div.js";
import { Head } from "./Head.js";
import { P } from "./P.js";
import { TeiHeader } from "./TeiHeader.js";

export const tagCatalog: Record<
	string,
	ComponentType<{
		data: DocumentJson;
		depth?: number;
	}>
> = {
	p: P,
	teiHeader: TeiHeader,
	head: Head,
	div: Div,
};
