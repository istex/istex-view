import type { ComponentType } from "react";
import { Hi } from "../Hi";
import { Highlight } from "../Highlight";
import { NoOp } from "../NoOp";
import { P } from "../P";
import { Ref } from "../Ref";
import type { ComponentProps } from "../type";
import { FigDesc } from "./FigDesc";
import { Head } from "./Head";

export const figureTagCatalog: Record<string, ComponentType<ComponentProps>> = {
	head: Head,
	label: Head,
	figDesc: FigDesc,
	caption: FigDesc,
	desc: FigDesc,
	note: NoOp,
	p: P,
	ref: Ref,
	hi: Hi,
	"#text": NoOp,
	highlightedText: NoOp,
	highlight: Highlight as unknown as ComponentType<ComponentProps>,
};
