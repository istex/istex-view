import type { DocumentJson } from "../parser/document.js";

export type ComponentProps = {
	data: DocumentJson;
	depth?: number;
};
