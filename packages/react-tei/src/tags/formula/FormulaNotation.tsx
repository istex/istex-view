import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { FormulaNotationMathML } from "./FormulaNotationMathML";

export function FormulaNotation({ data }: ComponentProps) {
	const notation = data.attributes?.["@notation"];

	switch (notation) {
		case "mathml":
			return <FormulaNotationMathML data={data} />;

		default:
			return (
				<DebugTag
					tag={data.tag}
					attributes={data.attributes}
					payload={data}
					message={`Unsupported notation attribute (${notation}) on <formula> tag`}
				/>
			);
	}
}
