// Split a container term into ordered subTerms based on contained terms
// Handles N overlapping terms by merging overlapping regions

import { findTermPosition } from "./findTermPosition";
import type { NestedTerm } from "./types";

type TermWithPosition = {
	term: NestedTerm;
	start: number;
	end: number;
};

type SubTermAtPosition = {
	subTerm: NestedTerm;
	start: number;
	end: number;
	fromTermGroups: string[];
};

// Group overlapping terms together (terms that share positions are in the same group)
const groupOverlappingTerms = (
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

// Helper to propagate parent groups to a subTerm and its descendants
const propagateGroupsToSubTerm = (
	subTerm: NestedTerm,
	parentGroups: string[],
): NestedTerm => {
	const combinedGroups = [...new Set([...parentGroups, ...subTerm.groups])];
	return {
		...subTerm,
		groups: combinedGroups,
		...(subTerm.subTerms && {
			subTerms: subTerm.subTerms.map((st) =>
				propagateGroupsToSubTerm(st, combinedGroups),
			),
		}),
	};
};

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

// Compute groups filtering out artificial terms
const computeNonArtificialGroups = (
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
		...new Set(nonArtificialTerms.map((t) => t.term.term)),
	];

	if (uniqueTermValues.length === 1) {
		return uniqueTermValues[0]!;
	}

	return null;
};

// Create a segment from boundary positions
const createSegmentFromBoundary = (
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
			term: segmentText,
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
			term: segmentText,
			groups: parentGroups,
			artificial: true,
		};
	}

	// Covered by terms but no exact subTerm match - create segment from covering terms
	const groups = computeNonArtificialGroups(allCoveringTerms, parentGroups);
	const sourceTerm = computeSourceTerm(coveringTermsFromGroup);

	return {
		term: segmentText,
		groups,
		sourceTerm,
	};
};

// Process multiple overlapping terms into segments
const processOverlappingTerms = (
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
				...processOverlappingTerms(
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
