import { propagateGroupsToSubTerm } from "./propagateGroupsToSubTerm";
import type { NestedTerm, SubTermAtPosition, TermWithPosition } from "./types";

// Compute groups filtering out artificial terms
export const computeNonArtificialGroups = (
	coveringTerms: TermWithPosition[],
	parentGroups: string[],
): string[] => {
	// Filter out groups from artificial terms
	const nonArtificialGroups = coveringTerms
		.filter((t) => !t.term.artificial)
		.flatMap((t) => t.term.groups);

	return [...new Set([...parentGroups, ...nonArtificialGroups])].sort();
};

// Compute source term from covering terms
// Returns slugified term if all non-artificial terms have the same term, null otherwise
const computeSourceTerm = (
	coveringTerms: TermWithPosition[],
): string | null => {
	const nonArtificialTerms = coveringTerms.filter((t) => !t.term.artificial);

	if (nonArtificialTerms.length === 0) return null;

	const uniqueTermValues = [
		...new Set(nonArtificialTerms.map((t) => t.term.targetText)),
	];

	if (uniqueTermValues.length === 1) {
		return uniqueTermValues[0]!;
	}

	return null;
};

// Create a segment from boundary positions
export const createSegmentFromBoundary = (
	segStart: number,
	segEnd: number,
	containerTerm: string,
	overlappingGroup: TermWithPosition[],
	allTerms: TermWithPosition[],
	subTermsByPosition: SubTermAtPosition[],
	parentGroups: string[],
): NestedTerm | null => {
	const segmentText = containerTerm.slice(segStart, segEnd);
	if (segmentText === "") return null;

	// Find which terms from the overlapping group cover this segment
	const coveringTermsFromGroup = overlappingGroup.filter(
		(t) => t.start <= segStart && t.end >= segEnd,
	);

	// Find ALL terms that cover this segment (for group computation)
	const allCoveringTerms = allTerms.filter(
		(t) => t.start <= segStart && t.end >= segEnd,
	);

	// Find subTerms that exactly match this segment
	const matchingSubTerms = subTermsByPosition.filter(
		(st) => st.start === segStart && st.end === segEnd,
	);

	if (matchingSubTerms.length > 0) {
		// This segment exactly matches one or more subTerms - merge their properties
		const baseSubTerm = matchingSubTerms[0]!.subTerm;

		// For artificial subTerms (filler text), only use parentGroups
		// For non-artificial subTerms, merge groups from non-artificial covering terms
		const isArtificialSegment = baseSubTerm.artificial;
		const allGroups = isArtificialSegment
			? computeNonArtificialGroups(allCoveringTerms, [])
			: computeNonArtificialGroups(allCoveringTerms, parentGroups);

		// Compute source term (using only the overlapping group for this)
		const sourceTerm = computeSourceTerm(coveringTermsFromGroup);

		// Recursively propagate groups to nested subTerms if any
		let nestedSubTerms = baseSubTerm.subTerms;
		if (nestedSubTerms) {
			nestedSubTerms = nestedSubTerms.map((st) =>
				propagateGroupsToSubTerm(st, allGroups),
			);
		}

		return {
			targetText: segmentText,
			groups: allGroups,
			sourceTerm,
			...(baseSubTerm.artificial && { artificial: true }),
			...(nestedSubTerms &&
				nestedSubTerms.length > 0 && { subTerms: nestedSubTerms }),
		};
	}

	if (coveringTermsFromGroup.length === 0) {
		// No covering term from the overlapping group - this is filler text
		return {
			targetText: segmentText,
			groups: parentGroups,
			artificial: true,
		};
	}

	// Covered by terms but no exact subTerm match - create segment from covering terms
	const groups = computeNonArtificialGroups(allCoveringTerms, parentGroups);
	const sourceTerm = computeSourceTerm(coveringTermsFromGroup);

	return {
		targetText: segmentText,
		groups,
		sourceTerm,
	};
};
