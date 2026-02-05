import { kebabCasify } from "../helper/kebabCasify";
import type { DocumentJson } from "../parser/document";
import {
	type ExtractionResult,
	extractTextWithPositions,
	findSpannedPositions,
	getSliceBoundaries,
	type StopTagPosition,
	type TextPosition,
} from "./extractTextWithPositions";
import type {
	HighlightTag,
	TermData,
	TextTag,
} from "./highlightTermsInTextTag";
import {
	incrementTermCountInRegistry,
	type TermCountByGroup,
} from "./termCountRegistry";

type Match = {
	index: number;
	length: number;
	text: string;
	termData: TermData;
};

/**
 * Find all term matches in the concatenated text, sorted by position
 */
const findAllMatches = (text: string, termDataList: TermData[]): Match[] => {
	const matches: Match[] = [];

	for (const termData of termDataList) {
		const { termRegex } = termData;
		// Reset regex lastIndex for each search
		termRegex.lastIndex = 0;
		const regexMatches = Array.from(text.matchAll(termRegex));

		for (const match of regexMatches) {
			matches.push({
				index: match.index ?? 0,
				length: match[0].length,
				text: match[0],
				termData,
			});
		}
	}

	// Sort by position, then by length (longer matches first for overlapping)
	return matches.sort((a, b) => {
		if (a.index !== b.index) return a.index - b.index;
		return b.length - a.length;
	});
};

/**
 * Filter matches to remove overlapping ones (keep longer/earlier matches)
 */
const removeOverlappingMatches = (matches: Match[]): Match[] => {
	const result: Match[] = [];
	let lastEnd = 0;

	for (const match of matches) {
		if (match.index >= lastEnd) {
			result.push(match);
			lastEnd = match.index + match.length;
		}
	}

	return result;
};

/**
 * Reconstruct nodes for a range, handling cross-tag spans
 */
const reconstructNodesForRange = (
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
 * Clone a node structure following a path to a text node
 */
const cloneNodeAtPath = (
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
 * Create a partial structure with sliced text
 */
const createPartialStructureAtPath = (
	node: DocumentJson,
	remainingPath: number[],
	slicedText: string,
): DocumentJson => {
	if (remainingPath.length === 0) {
		if (node.tag === "#text") {
			return { tag: "#text", value: slicedText };
		}
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
		value: [
			createPartialStructureAtPath(child, remainingPath.slice(1), slicedText),
		],
	};
};

/**
 * Merge adjacent text nodes
 */
const mergeAdjacentStructures = (nodes: DocumentJson[]): DocumentJson[] => {
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
 * Check if a match spans multiple text positions (cross-tag match)
 */
const isCrossTagMatch = (
	positions: TextPosition[],
	matchStart: number,
	matchEnd: number,
): boolean => {
	const spanned = findSpannedPositions(positions, matchStart, matchEnd);
	return spanned.length > 1;
};

/**
 * Get stop tags that should be inserted at a specific position
 */
const getStopTagsAtPosition = (
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
 * Build the result array from matches and non-matched segments
 */
const buildResultFromMatches = (
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

		if (crossTag) {
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

/**
 * Main function to highlight terms across children nodes.
 * Handles both single-tag and cross-tag term matches.
 */
export const highlightTermsInChildren = (
	termCountByGroupRegistry: TermCountByGroup,
	children: DocumentJson[],
	termDataList: TermData[],
	isStopTag: (tag: DocumentJson) => boolean = () => false,
): DocumentJson[] => {
	// Extract text with position tracking
	const extraction = extractTextWithPositions(children, isStopTag);
	const { text } = extraction;

	if (!text) {
		return children;
	}

	// Find all matches
	const allMatches = findAllMatches(text, termDataList);

	if (allMatches.length === 0) {
		return children;
	}

	// Remove overlapping matches
	const nonOverlappingMatches = removeOverlappingMatches(allMatches);

	// Build result
	return buildResultFromMatches(
		termCountByGroupRegistry,
		children,
		extraction,
		nonOverlappingMatches,
	);
};
