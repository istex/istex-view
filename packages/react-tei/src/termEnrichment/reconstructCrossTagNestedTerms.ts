import type { DocumentJson } from "../parser/document";
import type { TextPosition } from "./extractTextWithPositions";
import { reconstructNodesForRange } from "./reconstructNodesForRange";
import type { HighlightTag, TextTag } from "./types";

/**
 * Extract text content from a highlight value (for calculating subTerm lengths)
 */
export const getTextFromHighlightValue = (
	value: (TextTag | HighlightTag)[] | string,
): string => {
	if (typeof value === "string") {
		return value;
	}
	return value
		.map((node) => {
			if (node.tag === "#text") {
				return node.value;
			}
			if (node.tag === "highlight" && Array.isArray(node.value)) {
				return getTextFromHighlightValue(node.value);
			}
			return "";
		})
		.join("");
};

/**
 * Reconstruct cross-tag matches while preserving nested term structure.
 * Maps each subTerm in the pre-computed value to actual nodes from the document.
 */
export const reconstructCrossTagNestedTerms = (
	children: DocumentJson[],
	positions: TextPosition[],
	matchStart: number,
	nestedValue: HighlightTag[],
): (TextTag | HighlightTag)[] => {
	let currentPos = matchStart;

	return nestedValue.map((subTerm) => {
		const subTermText = getTextFromHighlightValue(subTerm.value);
		const subTermLength = subTermText.length;
		const subTermEnd = currentPos + subTermLength;

		const reconstructedNodes = reconstructNodesForRange(
			children,
			positions,
			currentPos,
			subTermEnd,
		);

		currentPos = subTermEnd;

		return {
			...subTerm,
			value: reconstructedNodes as (TextTag | HighlightTag)[],
		};
	});
};
