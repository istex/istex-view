import type { DocumentJson } from "../parser/document";
import {
	findSpannedPositions,
	getSliceBoundaries,
	type TextPosition,
} from "./extractTextWithPositions";
import { createPartialStructureAtPath } from "./highlightTermsInChildren";

/**
 * Clone a node structure following a path to a text node
 */
export const cloneNodeAtPath = (
	node: DocumentJson,
	remainingPath: number[],
): DocumentJson => {
	if (remainingPath.length === 0 || node.tag === "#text") {
		return node;
	}

	if (!Array.isArray(node.value)) {
		return node;
	}

	const childIndex = remainingPath[0] as number;
	const child = node.value[childIndex];

	if (!child) {
		return node;
	}

	return {
		...node,
		value: [cloneNodeAtPath(child, remainingPath.slice(1))],
	};
};

/**
 * Merge adjacent text nodes
 */
export const mergeAdjacentStructures = (
	nodes: DocumentJson[],
): DocumentJson[] => {
	return nodes.reduce<DocumentJson[]>((acc, node) => {
		const last = acc[acc.length - 1];
		if (
			last &&
			last.tag === "#text" &&
			node.tag === "#text" &&
			typeof last.value === "string" &&
			typeof node.value === "string"
		) {
			last.value += node.value;
		} else {
			acc.push(node);
		}
		return acc;
	}, []);
};

/**
 * Reconstruct nodes for a range, handling cross-tag spans
 */
export const reconstructNodesForRange = (
	children: DocumentJson[],
	positions: TextPosition[],
	rangeStart: number,
	rangeEnd: number,
): DocumentJson[] => {
	const spannedPositions = findSpannedPositions(
		positions,
		rangeStart,
		rangeEnd,
	);

	if (spannedPositions.length === 0) {
		return [];
	}

	const result = spannedPositions
		.map((position) => {
			const { start, end } = getSliceBoundaries(position, rangeStart, rangeEnd);
			const textValue = position.node.value as string;
			const slicedText = textValue.slice(start, end);
			if (slicedText.length === 0) {
				return null;
			}

			if (position.path.length === 1) {
				return {
					tag: "#text",
					value: slicedText,
				} as DocumentJson;
			}
			const topIndex = position.path[0] as number;
			const topNode = children[topIndex];
			if (!topNode) {
				return null;
			}
			const isFullText = start === 0 && end === textValue.length;

			if (isFullText) {
				return cloneNodeAtPath(topNode, position.path.slice(1));
			}
			return createPartialStructureAtPath(
				topNode,
				position.path.slice(1),
				slicedText,
			);
		})
		.filter((node): node is DocumentJson => node !== null);

	return mergeAdjacentStructures(result);
};
