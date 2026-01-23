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
			value: term.targetText,
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
				: kebabCasify(term.targetText);

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
						value: term.targetText,
					},
				],
		attributes: {
			groups: term.groups,
			term: termAttribute,
		} as HighlightTag["attributes"],
	};
};

export const getTermRegexes = (terms: NestedTerm[]) => {
	return terms.flatMap(({ targetText, groups, subTerms }) => {
		if (groups.includes("teeft")) {
			if (groups.length > 1) {
				return [
					{
						termRegex: termToRegex(targetText, true),
						targetText,
						groups: ["teeft"],
						value: subTerms?.length ? subTerms.map(termToTag) : targetText,
					},
					{
						termRegex: termToRegex(targetText, false),
						targetText,
						groups: groups.filter((g) => g !== "teeft"),
						value: subTerms?.length ? subTerms.map(termToTag) : targetText,
					},
				];
			}

			return [
				{
					termRegex: termToRegex(targetText, true),
					targetText,
					groups: ["teeft"],
					value: subTerms?.length ? subTerms.map(termToTag) : targetText,
				},
			];
		}
		return [
			{
				termRegex: termToRegex(targetText),
				targetText,
				groups,
				value: subTerms?.length ? subTerms.map(termToTag) : targetText,
			},
		];
	});
};

// A stop tag is a tag where term enrichment should not be applied within its children
// We do not want to highlight terms inside latex or mathml formulas asd it would break the formula rendering
export const isStopTag = (tag: DocumentJson): boolean => {
	if (tag.tag === "formula") {
		return true;
	}
	return false;
};

export const enrichDocumentWithTerms = (
	document: DocumentJson,
	termByGroup: Record<string, TermStatistic[]>,
): DocumentJson => {
	const terms = computeEnrichedTerms(termByGroup);

	const sortedTerms = [...terms].sort(
		(a, b) => b.targetText.length - a.targetText.length,
	);
	const termRegexes = getTermRegexes(sortedTerms);

	const enrichNode = (node: DocumentJson) => {
		if (isTextTag(node)) {
			return highlightTermsInTextTag(node, termRegexes);
		}
		return node;
	};

	return mapTargetTags(document, "#text", enrichNode, isStopTag);
};
