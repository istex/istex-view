import type { ComponentType } from "react";
import { Hi } from "../Hi";
import { Highlight } from "../Highlight";
import { NoOp } from "../NoOp";
import type { ComponentProps } from "../type";
import { FigDesc } from "./FigDesc";
import { Head } from "./Head";

export const figureTagCatalog: Record<string, ComponentType<ComponentProps>> = {
	head: Head,
	label: Head,
	figDesc: FigDesc,
	hi: Hi,
	"#text": NoOp,
	highlightedText: NoOp,
	highlight: Highlight as unknown as ComponentType<ComponentProps>,
};
