import { kebabCasify } from "../helper/kebabCasify";
import type { DocumentJson } from "../parser/document";
import {
	type ExtractionResult,
	findSpannedPositions,
	getSliceBoundaries,
	type StopTagPosition,
	type TextPosition,
} from "./extractTextWithPositions";
import { createPartialStructureAtPath } from "./highlightTermsInChildren";
import {
	incrementTermCountInRegistry,
	type TermCountByGroup,
} from "./termCountRegistry";
import type { HighlightTag, TermData, TextTag } from "./types";

export type Match = {
	index: number;
	length: number;
	text: string;
	termData: TermData;
};

/**
 * Get stop tags that should be inserted at a specific position
 */
export const getStopTagsAtPosition = (
	stopTags: StopTagPosition[],
	position: number,
	insertedStopTags: Set<number>,
): DocumentJson[] => {
	return stopTags
		.map((stopTag, index) => {
			if (
				stopTag.positionInConcat === position &&
				!insertedStopTags.has(index)
			) {
				insertedStopTags.add(index);
				return stopTag.node;
			}
			return null;
		})
		.filter((node): node is DocumentJson => node !== null);
};

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
	const result: DocumentJson[] = [];

	for (const node of nodes) {
		const last = result[result.length - 1];

		// Merge adjacent text nodes
		if (
			last &&
			last.tag === "#text" &&
			node.tag === "#text" &&
			typeof last.value === "string" &&
			typeof node.value === "string"
		) {
			last.value = last.value + node.value;
			continue;
		}

		result.push(node);
	}

	return result;
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

/**
 * Check if a match spans multiple text positions (cross-tag match)
 */
export const isCrossTagMatch = (
	positions: TextPosition[],
	matchStart: number,
	matchEnd: number,
): boolean => {
	const spanned = findSpannedPositions(positions, matchStart, matchEnd);
	return spanned.length > 1;
};

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

/**
 * Build the result array from matches and non-matched segments
 */
export const buildResultFromMatches = (
	termCountByGroupRegistry: TermCountByGroup,
	children: DocumentJson[],
	extraction: ExtractionResult,
	matches: Match[],
): DocumentJson[] => {
	const { text, positions, stopTags } = extraction;
	const result: DocumentJson[] = [];
	let lastEnd = 0;
	const insertedStopTags = new Set<number>();

	for (const match of matches) {
		// Add stop tags that appear before this match
		result.push(...getStopTagsAtPosition(stopTags, lastEnd, insertedStopTags));

		// Add non-matched content before this match
		if (match.index > lastEnd) {
			const beforeNodes = reconstructNodesForRange(
				children,
				positions,
				lastEnd,
				match.index,
			);
			result.push(...beforeNodes);

			// Check for stop tags within the before range
			for (let pos = lastEnd + 1; pos <= match.index; pos++) {
				result.push(...getStopTagsAtPosition(stopTags, pos, insertedStopTags));
			}
		}

		// Add the highlighted match
		const matchEnd = match.index + match.length;
		const { termData } = match;
		const { term, groups, value } = termData;

		// Increment term count
		incrementTermCountInRegistry(
			termCountByGroupRegistry,
			groups.join("+"),
			value,
		);

		// For cross-tag matches, always reconstruct the content
		const crossTag = isCrossTagMatch(positions, match.index, matchEnd);

		let highlightValue: (TextTag | HighlightTag)[];

		if (crossTag && value && Array.isArray(value)) {
			// Cross-tag match with pre-computed nested structure (overlapping terms)
			// We need to map each subTerm to the actual nodes from the document
			highlightValue = reconstructCrossTagNestedTerms(
				children,
				positions,
				match.index,
				value as HighlightTag[],
			);
		} else if (crossTag) {
			// Cross-tag match: reconstruct the spanning nodes
			highlightValue = reconstructNodesForRange(
				children,
				positions,
				match.index,
				matchEnd,
			) as (TextTag | HighlightTag)[];
		} else if (value && Array.isArray(value)) {
			// Has pre-computed value (for nested terms)
			highlightValue = value;
		} else {
			// Simple single-tag match: wrap in a text node array
			highlightValue = [{ tag: "#text", value: match.text }];
		}

		const highlightNode: HighlightTag = {
			tag: "highlight",
			value: highlightValue,
			attributes: {
				groups,
				term: kebabCasify(term),
			} as HighlightTag["attributes"],
		};

		result.push(highlightNode);
		lastEnd = matchEnd;
	}

	// Add any remaining stop tags
	result.push(...getStopTagsAtPosition(stopTags, lastEnd, insertedStopTags));

	// Add remaining content after last match
	if (lastEnd < text.length) {
		const afterNodes = reconstructNodesForRange(
			children,
			positions,
			lastEnd,
			text.length,
		);
		result.push(...afterNodes);

		// Check for any remaining stop tags
		for (let pos = lastEnd + 1; pos <= text.length; pos++) {
			result.push(...getStopTagsAtPosition(stopTags, pos, insertedStopTags));
		}
	}

	// Add any stop tags that haven't been inserted yet (at the end)
	for (let i = 0; i < stopTags.length; i++) {
		if (!insertedStopTags.has(i)) {
			result.push(stopTags[i]!.node);
		}
	}

	return result;
};
