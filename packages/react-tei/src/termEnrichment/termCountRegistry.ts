import { kebabCasify } from "../helper/kebabCasify";
import type { HighlightTag, TermData } from "./highlightTermsInTextTag";

export type TermCountByValue = Record<string, number>;
export type TermCountByGroup = Record<string, TermCountByValue>;

export function incrementTermCountInRegistry(
	registry: TermCountByGroup,
	groups: string,
	term: TermData["value"],
) {
	if (!term) {
		return;
	}

	const groupList = groups.split("+").map((g) => g.trim());
	if (typeof term === "string") {
		const termKey = kebabCasify(term);
		for (const group of groupList) {
			if (registry[group]?.[termKey] !== undefined) {
				registry[group][termKey] += 1;
			}
		}
		return;
	}

	const highlightTag = term.filter(
		(t): t is HighlightTag => t.tag === "highlight",
	);
	const textTag = term.filter(
		(t): t is { tag: "#text"; value: string } => t.tag === "#text",
	);

	const highlightedTerms = [
		...highlightTag.map((h) => ({
			term: h.attributes.term,
			groups: h.attributes.groups,
		})),
		...textTag.map((t) => ({ term: kebabCasify(t.value), groups: groupList })),
	];

	const uniqueHighlightedTerms = Array.from(
		new Map(
			highlightedTerms.map((item) => [
				`${item.term}/${item.groups.join("+")}`,
				item,
			]),
		).values(),
	);

	for (const { term, groups } of uniqueHighlightedTerms) {
		for (const group of groups) {
			if (registry[group]?.[term] !== undefined) {
				registry[group][term] += 1;
			}
		}
	}
}
