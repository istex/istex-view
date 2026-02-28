import type { DocumentJson } from "../parser/document";
import { buildResultFromMatches, type Match } from "./buildResultFromMatches";
import { extractTextWithPositions } from "./extractTextWithPositions";
import type { TermCountByGroup } from "./termCountRegistry";
import type { TermData } from "./types";

/**
 * Find all term matches in the concatenated text, sorted by position
 */
export const findAllMatches = (
	text: string,
	termDataList: TermData[],
): Match[] => {
	return termDataList
		.flatMap((termData) => {
			const { termRegex } = termData;
			// Reset regex lastIndex for each search
			termRegex.lastIndex = 0;
			const regexMatches = Array.from(text.matchAll(termRegex));

			return regexMatches.map((match) => ({
				index: match.index ?? 0,
				length: match[0].length,
				text: match[0],
				termData,
			}));
		})
		.sort((a, b) => {
			if (a.index !== b.index) return a.index - b.index;
			return b.length - a.length;
		});
};

/**
 * Filter matches to remove overlapping ones (keep longer/earlier matches)
 */
export const removeOverlappingMatches = (matches: Match[]): Match[] => {
	return matches.reduce<Match[]>((result, match) => {
		const lastMatch = result[result.length - 1];
		if (!lastMatch || match.index >= lastMatch.index + lastMatch.length) {
			result.push(match);
		}
		return result;
	}, []);
};

/**
 * Create a partial structure with sliced text
 */
export const createPartialStructureAtPath = (
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

export type HighlightResult = {
	nodes: DocumentJson[];
	registry: TermCountByGroup;
};

/**
 * Try to find matches within a single text node's content.
 * This ensures terms wholly contained in a single tag are matched,
 * even when adjacent tags would create invalid word boundaries.
 */
const findMatchesInSingleNode = (
	nodeText: string,
	nodeStartInConcat: number,
	termDataList: TermData[],
): Match[] => {
	return termDataList
		.flatMap((termData) => {
			const { termRegex } = termData;
			termRegex.lastIndex = 0;
			const regexMatches = Array.from(nodeText.matchAll(termRegex));

			return regexMatches.map((match) => ({
				// Adjust index to be relative to the concatenated string
				index: nodeStartInConcat + (match.index ?? 0),
				length: match[0].length,
				text: match[0],
				termData,
			}));
		})
		.sort((a, b) => {
			if (a.index !== b.index) return a.index - b.index;
			return b.length - a.length;
		});
};

/**
 * Main function to highlight terms across children nodes.
 * Handles both single-tag and cross-tag term matches.
 *
 * Strategy:
 * 1. First, find all matches within individual text nodes (single-tag matching)
 * 2. Then, find matches across the full concatenated text (cross-tag matching)
 * 3. Merge both sets, removing overlaps (single-tag matches take priority)
 */
export const highlightTermsInChildren = (
	termCountByGroupRegistry: TermCountByGroup,
	children: DocumentJson[],
	termDataList: TermData[],
	isStopTag: (tag: DocumentJson) => boolean = () => false,
): HighlightResult => {
	// Extract text with position tracking
	const extraction = extractTextWithPositions(children, isStopTag);
	const { text, positions } = extraction;

	if (!text) {
		return { nodes: children, registry: termCountByGroupRegistry };
	}

	// Step 1: Find matches within individual text nodes (single-tag matching)
	// This ensures terms wholly contained in a single tag are found,
	// even when adjacent tags create invalid word boundaries in concatenated text
	const singleTagMatches = positions.flatMap((pos) => {
		const nodeText =
			typeof pos.node.value === "string"
				? pos.node.value.slice(pos.textStart, pos.textEnd)
				: "";
		return findMatchesInSingleNode(nodeText, pos.startInConcat, termDataList);
	});

	// Step 2: Find matches across the full concatenated text (cross-tag matching)
	const crossTagMatches = findAllMatches(text, termDataList);

	// Step 3: Merge matches, prioritizing single-tag matches
	// Combine both sets and sort by position, then length (longer matches first)
	const allMatches = [...singleTagMatches, ...crossTagMatches].sort((a, b) => {
		if (a.index !== b.index) return a.index - b.index;
		return b.length - a.length;
	});

	if (allMatches.length === 0) {
		return { nodes: children, registry: termCountByGroupRegistry };
	}

	// Remove overlapping matches (this naturally deduplicates matches found in both passes)
	const nonOverlappingMatches = removeOverlappingMatches(allMatches);

	// Build result
	return buildResultFromMatches(
		termCountByGroupRegistry,
		children,
		extraction,
		nonOverlappingMatches,
	);
};
