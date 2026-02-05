import { kebabCasify } from "../helper/kebabCasify";
import type { DocumentJson } from "../parser/document";
import {
	type ExtractionResult,
	findSpannedPositions,
	type StopTagPosition,
	type TextPosition,
} from "./extractTextWithPositions";
import { reconstructCrossTagNestedTerms } from "./reconstructCrossTagNestedTerms";
import { reconstructNodesForRange } from "./reconstructNodesForRange";
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
 * Get stop tags in a range of positions
 */
export const getStopTagsInRange = (
	stopTags: StopTagPosition[],
	startPos: number,
	endPos: number,
	insertedStopTags: Set<number>,
): DocumentJson[] =>
	Array.from({ length: endPos - startPos }, (_, i) => startPos + i + 1).flatMap(
		(pos) => getStopTagsAtPosition(stopTags, pos, insertedStopTags),
	);

/**
 * Compute the highlight value based on match type
 */
export const computeHighlightValue = (
	match: Match,
	children: DocumentJson[],
	positions: TextPosition[],
): (TextTag | HighlightTag)[] => {
	const matchEnd = match.index + match.length;
	const { value } = match.termData;
	const crossTag = isCrossTagMatch(positions, match.index, matchEnd);

	if (crossTag && value && Array.isArray(value)) {
		// Cross-tag match with pre-computed nested structure (overlapping terms)
		return reconstructCrossTagNestedTerms(
			children,
			positions,
			match.index,
			value as HighlightTag[],
		);
	}

	if (crossTag) {
		// Cross-tag match: reconstruct the spanning nodes
		return reconstructNodesForRange(
			children,
			positions,
			match.index,
			matchEnd,
		) as (TextTag | HighlightTag)[];
	}

	if (value && Array.isArray(value)) {
		// Has pre-computed value (for nested terms)
		return value;
	}

	// Simple single-tag match: wrap in a text node array
	return [{ tag: "#text", value: match.text }];
};

/**
 * Create a highlight node from a match
 */
export const createHighlightNode = (
	match: Match,
	children: DocumentJson[],
	positions: TextPosition[],
): HighlightTag => ({
	tag: "highlight",
	value: computeHighlightValue(match, children, positions),
	attributes: {
		groups: match.termData.groups,
		term: kebabCasify(match.termData.term),
	} as HighlightTag["attributes"],
});

/**
 * Get nodes before a match (non-matched content + stop tags)
 */
export const getNodesBeforeMatch = (
	match: Match,
	lastEnd: number,
	children: DocumentJson[],
	positions: TextPosition[],
	stopTags: StopTagPosition[],
	insertedStopTags: Set<number>,
): DocumentJson[] => {
	const stopTagsAtLastEnd = getStopTagsAtPosition(
		stopTags,
		lastEnd,
		insertedStopTags,
	);

	if (match.index <= lastEnd) {
		return stopTagsAtLastEnd;
	}

	const beforeNodes = reconstructNodesForRange(
		children,
		positions,
		lastEnd,
		match.index,
	);

	const stopTagsInRange = getStopTagsInRange(
		stopTags,
		lastEnd,
		match.index,
		insertedStopTags,
	);

	return [...stopTagsAtLastEnd, ...beforeNodes, ...stopTagsInRange];
};

/**
 * Get remaining nodes after all matches
 */
export const getRemainingNodes = (
	lastEnd: number,
	textLength: number,
	children: DocumentJson[],
	positions: TextPosition[],
	stopTags: StopTagPosition[],
	insertedStopTags: Set<number>,
): DocumentJson[] => {
	const stopTagsAtLastEnd = getStopTagsAtPosition(
		stopTags,
		lastEnd,
		insertedStopTags,
	);

	const afterNodes =
		lastEnd < textLength
			? reconstructNodesForRange(children, positions, lastEnd, textLength)
			: [];

	const stopTagsInRange =
		lastEnd < textLength
			? getStopTagsInRange(stopTags, lastEnd, textLength, insertedStopTags)
			: [];

	const remainingStopTags = stopTags
		.filter((_, index) => !insertedStopTags.has(index))
		.map((stopTag) => stopTag.node);

	return [
		...stopTagsAtLastEnd,
		...afterNodes,
		...stopTagsInRange,
		...remainingStopTags,
	];
};

type ReduceState = {
	nodes: DocumentJson[];
	lastEnd: number;
	registry: TermCountByGroup;
};

type BuildResult = {
	nodes: DocumentJson[];
	registry: TermCountByGroup;
};

/**
 * Build the result array from matches and non-matched segments
 */
export const buildResultFromMatches = (
	termCountByGroupRegistry: TermCountByGroup,
	children: DocumentJson[],
	extraction: ExtractionResult,
	matches: Match[],
): BuildResult => {
	const { text, positions, stopTags } = extraction;
	const insertedStopTags = new Set<number>();

	const { nodes, lastEnd, registry } = matches.reduce<ReduceState>(
		(acc, match) => {
			// Increment term count
			const updatedRegistry = incrementTermCountInRegistry(
				acc.registry,
				match.termData.groups.join("+"),
				match.termData.value,
			);

			const beforeNodes = getNodesBeforeMatch(
				match,
				acc.lastEnd,
				children,
				positions,
				stopTags,
				insertedStopTags,
			);

			const highlightNode = createHighlightNode(match, children, positions);

			return {
				nodes: [...acc.nodes, ...beforeNodes, highlightNode],
				lastEnd: match.index + match.length,
				registry: updatedRegistry,
			};
		},
		{ nodes: [], lastEnd: 0, registry: termCountByGroupRegistry },
	);

	const remainingNodes = getRemainingNodes(
		lastEnd,
		text.length,
		children,
		positions,
		stopTags,
		insertedStopTags,
	);

	return { nodes: [...nodes, ...remainingNodes], registry };
};
