import { createSegmentFromBoundary } from "./createSegmentFromBoundary";
import type { NestedTerm, SubTermAtPosition, TermWithPosition } from "./types";

// Collect all boundary points from overlapping terms and their subTerms
const collectBoundaries = (overlappingGroup: TermWithPosition[]): number[] => {
	const boundaries = new Set<number>();

	for (const t of overlappingGroup) {
		boundaries.add(t.start);
		boundaries.add(t.end);

		// Add boundaries from subTerms
		if (t.term.subTerms) {
			let subPos = t.start;
			for (const st of t.term.subTerms) {
				boundaries.add(subPos);
				boundaries.add(subPos + st.term.length);
				subPos += st.term.length;
			}
		}
	}

	return Array.from(boundaries).sort((a, b) => a - b);
};

// Build subTerms position map from overlapping terms
const buildSubTermsPositionMap = (
	overlappingGroup: TermWithPosition[],
): SubTermAtPosition[] => {
	return overlappingGroup.flatMap((t) => {
		if (!t.term.subTerms) return [];

		let subPos = t.start;
		return t.term.subTerms.map((st) => {
			const result = {
				subTerm: st,
				start: subPos,
				end: subPos + st.term.length,
				fromTermGroups: t.term.groups,
			};
			subPos += st.term.length;
			return result;
		});
	});
};

// Process multiple overlapping terms into segments
export const splitOverlappingTermsIntoSegments = (
	overlappingGroup: TermWithPosition[],
	allTerms: TermWithPosition[],
	containerTerm: string,
	parentGroups: string[],
): NestedTerm[] => {
	const sortedBoundaries = collectBoundaries(overlappingGroup);
	const subTermsByPosition = buildSubTermsPositionMap(overlappingGroup);

	// Build segments from consecutive boundary pairs
	const segments: NestedTerm[] = [];
	for (let k = 0; k < sortedBoundaries.length - 1; k++) {
		const segment = createSegmentFromBoundary(
			sortedBoundaries[k]!,
			sortedBoundaries[k + 1]!,
			containerTerm,
			overlappingGroup,
			allTerms,
			subTermsByPosition,
			parentGroups,
		);
		if (segment) {
			segments.push(segment);
		}
	}

	return segments;
};
