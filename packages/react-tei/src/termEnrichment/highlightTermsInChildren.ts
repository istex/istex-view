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
 * Main function to highlight terms across children nodes.
 * Handles both single-tag and cross-tag term matches.
 */
export const highlightTermsInChildren = (
	termCountByGroupRegistry: TermCountByGroup,
	children: DocumentJson[],
	termDataList: TermData[],
	isStopTag: (tag: DocumentJson) => boolean = () => false,
): HighlightResult => {
	// Extract text with position tracking
	const extraction = extractTextWithPositions(children, isStopTag);
	const { text } = extraction;

	if (!text) {
		return { nodes: children, registry: termCountByGroupRegistry };
	}

	// Find all matches
	const allMatches = findAllMatches(text, termDataList);

	if (allMatches.length === 0) {
		return { nodes: children, registry: termCountByGroupRegistry };
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
