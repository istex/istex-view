import { escapeRegexChars } from "../helper/termToRegex";
import { removeDuplicateNestedTerms } from "./removeDuplicateNestedTerms";
import { splitTermIntoSegments } from "./splitTermIntoSegments";
import type { GroupedTerm, NestedTerm } from "./types";

export const isContainedIn = (
	longer: GroupedTerm,
	shorter: GroupedTerm,
): boolean => {
	if (shorter.term === longer.term) return false;

	const shorterWordRegex = new RegExp(
		`(?<![\\p{L}\\p{N}])${escapeRegexChars(shorter.term)}(?![\\p{L}\\p{N}])`,
		"u",
	);
	if (longer.term.match(shorterWordRegex)) return true;
	return false;
};

export const nestContainedTerms = (terms: GroupedTerm[]): NestedTerm[] => {
	// Sort terms from smallest to largest - process smaller terms first
	// so they're available when processing larger containing terms
	const sortedTerms = [...terms].sort((a, b) => a.term.length - b.term.length);

	const nestedTerms = sortedTerms.reduce((acc, term, index) => {
		// Find all previously processed terms that are contained in this term
		const containedTerms = acc.filter((otherTerm) =>
			isContainedIn(term, otherTerm),
		) as NestedTerm[];

		if (containedTerms.length === 0) {
			// No contained terms - just add this term as-is
			acc[index] = {
				term: term.term,
				groups: term.groups,
				...(term.artificial && { artificial: true }),
			};
			return acc;
		}

		// Determine parent groups to pass down (artificial parents don't pass groups)
		const parentGroups = term.artificial ? [] : term.groups;

		// For non-artificial parents, pass slugified term so fillers get proper sourceTerm
		// For artificial parents, don't pass parentSourceTerm (fillers will compute from covering terms)
		const parentSourceTerm = term.artificial ? undefined : term.term;

		// Use the new segment-based splitting which handles N overlapping terms
		const subTerms = splitTermIntoSegments(
			term.term,
			containedTerms,
			parentGroups,
			parentSourceTerm,
		);

		acc[index] = {
			term: term.term,
			groups: term.groups,
			...(term.artificial && { artificial: true }),
			...(subTerms.length > 0 && { subTerms }),
		};

		return acc;
	}, [] as NestedTerm[]);

	return removeDuplicateNestedTerms(nestedTerms);
};
