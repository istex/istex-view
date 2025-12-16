import type { DocumentJson } from "../parser/document.js";
import { DocumentTag } from "./DocumentTag.js";

export const Div = ({ data: { value, attributes }, depth = 1 }: DivProps) => {
	if (!Array.isArray(value)) {
		console.warn("Div tag with non-array value:", value);
		return null;
	}

	return value.map((value, index) => (
		<DocumentTag
			key={index}
			data={value}
			depth={attributes?.["@type"] === "ElsevierSections" ? depth : depth + 1}
		/>
	));
};

type DivProps = { data: DocumentJson; depth?: number };
