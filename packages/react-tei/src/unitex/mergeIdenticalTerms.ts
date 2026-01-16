import type { GroupedTerm, NormalizedTerm } from "./types";

export const mergeIdenticalTerms = (terms: NormalizedTerm[]): GroupedTerm[] => {
	const mergedTerms: GroupedTerm[] = terms.reduce(
		(acc, { group, term, ...termRest }) => {
			const existing = acc.find((t) => t.term === term);
			if (existing) {
				if (!existing.groups.includes(group)) {
					existing.groups.push(group);
				}
			} else {
				acc.push({
					term,
					groups: [group],
					...termRest,
				});
			}
			return acc;
		},
		[] as GroupedTerm[],
	);

	return mergedTerms;
};
