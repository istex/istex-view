import { mapTargetTags } from "../helper/mapTargetTags";
import type { DocumentJson } from "../parser/document";
import { highlightTermsInTextTag, isTextTag } from "./highlightTermsInTextTag";
import type { TermStatistic } from "./parseUnitexEnrichment";

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
		termRegex: new RegExp(`\\b${term}\\b`, "gi"),
		group,
	}));

	const enrichNode = (node: DocumentJson) => {
		if (isTextTag(node)) {
			return highlightTermsInTextTag(node, termRegexes);
		}
		return node;
	};

	return mapTargetTags(document, "#text", enrichNode);
};
