import type { NestedTerm } from "./types";

export const hasIdenticalTermInSubTerms = (
	term: NestedTerm,
	subTerms: NestedTerm[],
): boolean => {
	for (const subTerm of subTerms) {
		if (subTerm.term === term.term) {
			return true;
		}
		if (subTerm.subTerms?.length) {
			if (hasIdenticalTermInSubTerms(term, subTerm.subTerms)) {
				return true;
			}
		}
	}
	return false;
};

// remove nestedTerms if they are already present in lower levels
// do this recursively on nested subterms
export const removeDuplicateNestedTerms = (
	terms: NestedTerm[],
): NestedTerm[] => {
	// First, recursively process all subTerms
	const termsWithProcessedSubTerms = terms.map((term) => {
		if (!term.subTerms || !term.subTerms.length) {
			return term;
		}
		return {
			...term,
			subTerms: removeDuplicateNestedTerms(term.subTerms),
		};
	});

	// Then filter out duplicates at this level
	return termsWithProcessedSubTerms.map((term) => {
		if (!term.subTerms || !term.subTerms.length) {
			return term;
		}

		// Filter out subTerms that are already present in any other sibling's nested structure
		// Skip artificial terms - they are allowed to be duplicated
		const filteredSubTerms = term.subTerms.filter((subTerm, index) => {
			// Don't filter artificial terms
			if (subTerm.artificial) return true;

			const otherSiblings = [
				...term.subTerms!.slice(0, index),
				...term.subTerms!.slice(index + 1),
			];
			return !hasIdenticalTermInSubTerms(subTerm, otherSiblings);
		});

		return {
			...term,
			subTerms: filteredSubTerms,
		};
	});
};
