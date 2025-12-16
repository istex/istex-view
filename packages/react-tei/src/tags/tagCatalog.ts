import type { ComponentType } from "react";
import { Div } from "./Div.js";
import { Head } from "./Head.js";
import { P } from "./P.js";
import { TeiHeader } from "./TeiHeader.js";

export const tagCatalog: Record<string, ComponentType<any>> = {
	p: P,
	teiHeader: TeiHeader,
	head: Head,
	div: Div,
};
