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

	const enrichNode = (node: DocumentJson) => {
		if (isTextTag(node)) {
			return highlightTermsInTextTag(node, terms);
		}
		return node;
	};

	return mapTargetTags(document, "#text", enrichNode);
};
