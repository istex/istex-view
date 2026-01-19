// Split a container term into ordered subTerms based on contained terms
// Handles N overlapping terms by merging overlapping regions

import { findTermPosition } from "./findTermPosition";
import { groupOverlappingTerms } from "./groupOverlappingTerms";
import { propagateGroupsToSubTerm } from "./propagateGroupsToSubTerm";
import { splitOverlappingTermsIntoSegments } from "./splitOverlappingTermsIntoSegments";
import type { NestedTerm, TermWithPosition } from "./types";

// Create filler segment for gaps between terms
// Create filler segment for gaps between terms
// sourceTerm is the slugified parent term (for non-artificial parents) or undefined (for artificial parents)
const createFillerSegment = (
	text: string,
	parentGroups: string[],
	sourceTerm?: string,
): NestedTerm => ({
	term: text,
	groups: parentGroups,
	artificial: true,
	...(sourceTerm !== undefined && { sourceTerm }),
});

// Process a single non-overlapping term
const processSingleTerm = (
	termWithPos: TermWithPosition,
	containedTerms: NestedTerm[],
	parentGroups: string[],
): NestedTerm => {
	const termData = termWithPos.term;
	const combinedGroups = [...new Set([...parentGroups, ...termData.groups])];

	// If term has subTerms, recursively update their groups
	let subTerms = termData.subTerms;
	if (subTerms && subTerms.length > 0) {
		subTerms = subTerms.map((st) =>
			propagateGroupsToSubTerm(st, combinedGroups),
		);
	} else {
		// Check if there are smaller contained terms we need to nest
		const smallerContained = containedTerms.filter(
			(ct) =>
				ct.term !== termData.term &&
				findTermPosition(termData.term, ct.term) !== null,
		);
		if (smallerContained.length > 0) {
			// Pass the slugified term as parentSourceTerm for filler segments
			subTerms = splitTermIntoSegments(
				termData.term,
				smallerContained,
				combinedGroups,
				termData.term,
			);
		}
	}

	return {
		term: termData.term,
		groups: combinedGroups,
		...(subTerms && subTerms.length > 0 && { subTerms }),
	};
};

// parentSourceTerm: for non-artificial parents, the slugified parent term; undefined for artificial parents
export const splitTermIntoSegments = (
	containerTerm: string,
	containedTerms: NestedTerm[],
	parentGroups: string[],
	parentSourceTerm?: string,
): NestedTerm[] => {
	if (containedTerms.length === 0) {
		return [];
	}

	// Step 1: Find positions of all contained terms and filter out those not found
	// Filter out artificial terms - we only want original terms as direct children
	const termsWithPositions: TermWithPosition[] = containedTerms
		.filter((term) => !term.artificial)
		.map((term) => {
			const pos = findTermPosition(containerTerm, term.term);
			return pos ? { term, start: pos.start, end: pos.end } : null;
		})
		.filter((t): t is TermWithPosition => t !== null)
		.sort((a, b) => a.start - b.start);

	if (termsWithPositions.length === 0) {
		return [];
	}

	// Step 2: Filter out terms that are fully contained in other terms
	// Keep only the "direct children" - terms not contained in other found terms
	const directChildren = termsWithPositions.filter((t) => {
		const isContainedInAnother = termsWithPositions.some(
			(other) =>
				other !== t &&
				other.start <= t.start &&
				other.end >= t.end &&
				!(other.start === t.start && other.end === t.end),
		);
		return !isContainedInAnother;
	});

	// Step 3: Group overlapping terms together
	const overlappingGroups = groupOverlappingTerms(directChildren);

	// Step 4: Process each group and build segments with fillers
	const segments: NestedTerm[] = [];
	let currentPos = 0;

	for (const group of overlappingGroups) {
		const groupStart = group[0]!.start;
		const groupEnd = Math.max(...group.map((t) => t.end));

		// Add filler text before this group if any
		if (groupStart > currentPos) {
			segments.push(
				createFillerSegment(
					containerTerm.slice(currentPos, groupStart),
					parentGroups,
					parentSourceTerm,
				),
			);
		}

		if (group.length === 1) {
			// Single term - no overlap
			segments.push(processSingleTerm(group[0]!, containedTerms, parentGroups));
		} else {
			// Multiple overlapping terms - pass all terms for group computation
			segments.push(
				...splitOverlappingTermsIntoSegments(
					group,
					termsWithPositions,
					containerTerm,
					parentGroups,
				),
			);
		}

		currentPos = groupEnd;
	}

	// Add any remaining filler text at the end
	if (currentPos < containerTerm.length) {
		segments.push(
			createFillerSegment(
				containerTerm.slice(currentPos),
				parentGroups,
				parentSourceTerm,
			),
		);
	}

	return segments;
};
