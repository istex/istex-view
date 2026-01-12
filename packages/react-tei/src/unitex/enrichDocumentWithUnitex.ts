import { mapTargetTags } from "../helper/mapTargetTags";
import type { DocumentJson } from "../parser/document";
import { highlightTermsInTextTag, isTextTag } from "./highlightTermsInTextTag";
import type { TermStatistic } from "./parseUnitexEnrichment";

const escapeRegexChars = (str: string): string => {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const termToRegex = (term: string): RegExp => {
	const escapedTerm = escapeRegexChars(term);
	return new RegExp(
		`(?<![\\p{L}\\p{N}])${escapedTerm}(?![\\p{L}\\p{N}])`,
		"gu",
	);
};

export const enrichDocumentWithUnitex = (
	document: DocumentJson,
	unitexEnrichment: Record<string, TermStatistic[]>,
): DocumentJson => {
	const terms = Object.entries(unitexEnrichment).flatMap(([group, termStats]) =>
		termStats.map((termStat) => ({
			term: termStat.term,
			group,
		})),
	);

	const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
	const termRegexes = sortedTerms.map(({ term, group }) => ({
		termRegex: termToRegex(term),
		group: [group],
	}));

	const enrichNode = (node: DocumentJson) => {
		if (isTextTag(node)) {
			return highlightTermsInTextTag(node, termRegexes);
		}
		return node;
	};

	return mapTargetTags(document, "#text", enrichNode);
};
