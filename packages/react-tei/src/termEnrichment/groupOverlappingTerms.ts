import type { TermWithPosition } from "./types";

// Group overlapping terms together (terms that share positions are in the same group)
export const groupOverlappingTerms = (
	terms: TermWithPosition[],
): TermWithPosition[][] => {
	if (terms.length === 0) return [];

	return terms.reduce<TermWithPosition[][]>((groups, term) => {
		const lastGroup = groups[groups.length - 1];

		if (!lastGroup) {
			// First term starts a new group
			return [[term]];
		}

		const groupEnd = Math.max(...lastGroup.map((t) => t.end));
		if (term.start < groupEnd) {
			// Term overlaps with current group - add to it
			lastGroup.push(term);
		} else {
			// No overlap - start a new group
			groups.push([term]);
		}

		return groups;
	}, []);
};
