import { kebabCasify } from "../helper/kebabCasify";
import { mapTargetTags } from "../helper/mapTargetTags";
import { termToRegex } from "../helper/termToRegex";
import type { DocumentJson } from "../parser/document";
import { computeEnrichedTerms } from "./computeEnrichedTerms";
import {
	type HighlightTag,
	highlightTermsInTextTag,
	isTextTag,
	type TextTag,
} from "./highlightTermsInTextTag";
import type { TermStatistic } from "./parseUnitexEnrichment";
import type { NestedTerm } from "./types";

export const termToTag = (term: NestedTerm): TextTag | HighlightTag => {
	if (term.groups.length === 0 && !term.subTerms?.length) {
		return {
			tag: "#text",
			value: term.term,
		};
	}

	// Determine the term attribute value:
	// - If sourceTerm is explicitly set (string), use it
	// - If sourceTerm is null, use null
	// - If sourceTerm is undefined (root term), use slugified term.term
	const termAttribute =
		term.sourceTerm === null
			? null
			: term.sourceTerm !== undefined
				? kebabCasify(term.sourceTerm)
				: kebabCasify(term.term);

	if (term.subTerms?.length && term.groups.length === 0) {
		return {
			tag: "highlight",
			value: term.subTerms.map(termToTag),
			attributes: {
				groups: [] as string[],
				term: termAttribute,
				noAnchor: true,
			} as HighlightTag["attributes"],
		};
	}

	return {
		tag: "highlight",
		value: term.subTerms
			? term.subTerms.map(termToTag)
			: [
					{
						tag: "#text",
						value: term.term,
					},
				],
		attributes: {
			groups: term.groups,
			term: termAttribute,
		} as HighlightTag["attributes"],
	};
};

export const enrichDocumentWithTerms = (
	document: DocumentJson,
	termByGroup: Record<string, TermStatistic[]>,
): DocumentJson => {
	const terms = computeEnrichedTerms(termByGroup);

	const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
	const termRegexes = sortedTerms.map(({ term, groups, subTerms }) => ({
		termRegex: termToRegex(term),
		term,
		groups,
		value: subTerms?.length ? subTerms.map(termToTag) : term,
	}));

	const enrichNode = (node: DocumentJson) => {
		if (isTextTag(node)) {
			return highlightTermsInTextTag(node, termRegexes);
		}
		return node;
	};

	return mapTargetTags(document, "#text", enrichNode);
};
