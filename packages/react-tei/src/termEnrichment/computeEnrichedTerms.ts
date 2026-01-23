import { getOverlappingTermsFromList } from "./getOverlappingTermsFromList";
import { mergeIdenticalTerms } from "./mergeIdenticalTerms";
import { nestContainedTerms } from "./nestContainedTerms";
import type { TermStatistic } from "./parseUnitexEnrichment";
import type { NestedTerm, NormalizedTerm } from "./types";

// Step 1: Normalize terms from termByGroup into flat list
const normalizeTerms = (
	termByGroup: Record<string, TermStatistic[]>,
): NormalizedTerm[] => {
	const normalized: NormalizedTerm[] = Object.entries(termByGroup).flatMap(
		([group, terms]) =>
			terms.map((termStat) => ({
				term: termStat.term,
				group,
			})),
	);

	return normalized;
};

export const computeEnrichedTerms = (
	termByGroup: Record<string, TermStatistic[]>,
): NestedTerm[] => {
	const normalizedTerms = normalizeTerms(termByGroup);

	const overlappingTerms = getOverlappingTermsFromList(normalizedTerms);

	const mergedNormalizedTerms = mergeIdenticalTerms(
		normalizedTerms.concat(overlappingTerms),
	);

	const nestedTerms = nestContainedTerms(mergedNormalizedTerms);

	return nestedTerms.sort((a, b) => b.targetText.length - a.targetText.length);
};
