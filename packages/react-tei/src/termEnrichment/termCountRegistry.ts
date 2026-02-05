import { kebabCasify } from "../helper/kebabCasify";
import type { HighlightTag, TermData } from "./types";

export type TermCountByValue = Record<string, number>;
export type TermCountByGroup = Record<string, TermCountByValue>;

export type TermWithGroups = {
	term: string;
	groups: string[];
};

/**
 * Extract term/groups pairs from a term value
 */
export const extractTermsWithGroups = (
	term: NonNullable<TermData["value"]>,
	groupList: string[],
): TermWithGroups[] => {
	if (typeof term === "string") {
		return [{ term: kebabCasify(term), groups: groupList }];
	}

	const highlightTerms = term
		.filter((t): t is HighlightTag => t.tag === "highlight")
		.map((h) => ({
			term: h.attributes.term,
			groups: h.attributes.groups,
		}));

	const textTerms = term
		.filter((t): t is { tag: "#text"; value: string } => t.tag === "#text")
		.map((t) => ({ term: kebabCasify(t.value), groups: groupList }));

	return [...highlightTerms, ...textTerms];
};

/**
 * Remove duplicate term/groups combinations
 */
export const deduplicateTerms = (terms: TermWithGroups[]): TermWithGroups[] =>
	Array.from(
		new Map(
			terms.map((item) => [`${item.term}/${item.groups.join("+")}`, item]),
		).values(),
	);

/**
 * Increment count in registry for a specific group and term, returning a new registry
 */
export const incrementIfExists = (
	registry: TermCountByGroup,
	group: string,
	term: string,
): TermCountByGroup => {
	if (registry[group]?.[term] === undefined) {
		return registry;
	}

	return {
		...registry,
		[group]: {
			...registry[group],
			[term]: registry[group][term] + 1,
		},
	};
};

export function incrementTermCountInRegistry(
	registry: TermCountByGroup,
	groups: string,
	term: TermData["value"] | null,
): TermCountByGroup {
	if (!term) {
		return registry;
	}

	const groupList = groups.split("+").map((g) => g.trim());

	const termsWithGroups = extractTermsWithGroups(term, groupList);
	const uniqueTerms = deduplicateTerms(termsWithGroups);

	return uniqueTerms.reduce(
		(acc, { term, groups }) =>
			groups.reduce(
				(innerAcc, group) => incrementIfExists(innerAcc, group, term),
				acc,
			),
		registry,
	);
}
