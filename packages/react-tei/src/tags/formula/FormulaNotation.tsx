import { useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
import { FormulaNotationLatex } from "./FormulaNotationLatex";
import { FormulaNotationMathML } from "./FormulaNotationMathML";

export const getFormulaType = (data: ComponentProps["data"]): string => {
	const notation = data.attributes?.["@notation"];

	if (notation === "tex") {
		return "latex";
	}
	if (notation === "mathml") {
		return "mathml";
	}
	if (notation) {
		return notation;
	}
	if (!Array.isArray(data.value)) {
		return "error";
	}

	// If no notation attribute, try to infer from children
	if (Array.isArray(data.value)) {
		if (data.value.some((child) => child.tag.endsWith("math"))) {
			return "mathml";
		}

		if (
			data.value.length === 1 &&
			data.value[0]?.tag === "#text" &&
			typeof data.value[0]?.value === "string" &&
			data.value[0].value.startsWith("\\")
		) {
			return "latex";
		}
	}

	return "text";
};

export function FormulaNotation({ data }: ComponentProps) {
	const notation = data.attributes?.["@notation"];

	const formulaType = useMemo(() => getFormulaType(data), [data]);

	switch (formulaType) {
		case "mathml":
			return <FormulaNotationMathML data={data} />;
		case "latex":
			return <FormulaNotationLatex data={data} />;
		case "text":
			return <Value data={data.value} />;

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
