import { mapTargetTags } from "../helper/mapTargetTags";
import { escapeRegexChars, termToRegex } from "../helper/termToRegex";
import type { DocumentJson } from "../parser/document";
import { getOverlappingTermsFromList } from "./getOverlappingTermsFromList";
import {
	type HighlightTag,
	highlightTermsInTextTag,
	isTextTag,
	type TextTag,
} from "./highlightTermsInTextTag";
import { mergeIdenticalTerms } from "./mergeIdenticalTerms";
import type { TermStatistic } from "./parseUnitexEnrichment";
import { removeDuplicateNestedTerms } from "./removeDuplicateNestedTerms";
import { splitTermIntoSegments } from "./splitTermIntoSegments";
import type { GroupedTerm, NestedTerm, NormalizedTerm } from "./types";

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

// Convert term text to slug format (lowercase, spaces to hyphens, preserve unicode letters)
const slugify = (text: string): string => {
	return text.toLowerCase().trim().replace(/\s+/g, "-");
};

export const isContainedIn = (
	longer: GroupedTerm,
	shorter: GroupedTerm,
): boolean => {
	if (shorter.groups.every((g) => longer.groups.includes(g))) {
		return false;
	}
	if (shorter.term === longer.term) return false;

	const shorterWordRegex = new RegExp(
		`(?<![\\p{L}\\p{N}])${escapeRegexChars(shorter.term)}(?![\\p{L}\\p{N}])`,
		"u",
	);
	if (longer.term.match(shorterWordRegex)) return true;
	return false;
};

export const getRemainingStringParts = (
	fullString: string[],
	subTerms: string[],
): string[] => {
	const [subTerm, ...restSubTerms] = subTerms;

	if (!subTerm) {
		return fullString;
	}
	const newFullString = fullString.flatMap((part) => {
		return part.split(subTerm).filter((p) => p !== "");
	});

	return getRemainingStringParts(newFullString, restSubTerms);
};

export const nestContainedTerms = (terms: GroupedTerm[]): NestedTerm[] => {
	// Sort terms from smallest to largest - process smaller terms first
	// so they're available when processing larger containing terms
	const sortedTerms = [...terms].sort((a, b) => a.term.length - b.term.length);

	const nestedTerms = sortedTerms.reduce((acc, term, index) => {
		// Find all previously processed terms that are contained in this term
		const containedTerms = acc.filter((otherTerm) =>
			isContainedIn(term, otherTerm),
		) as NestedTerm[];

		if (containedTerms.length === 0) {
			// No contained terms - just add this term as-is
			acc[index] = {
				term: term.term,
				groups: term.groups,
				...(term.artificial && { artificial: true }),
			};
			return acc;
		}

		// Determine parent groups to pass down (artificial parents don't pass groups)
		const parentGroups = term.artificial ? [] : term.groups;

		// For non-artificial parents, pass slugified term so fillers get proper sourceTerm
		// For artificial parents, don't pass parentSourceTerm (fillers will compute from covering terms)
		const parentSourceTerm = term.artificial ? undefined : term.term;

		// Use the new segment-based splitting which handles N overlapping terms
		const subTerms = splitTermIntoSegments(
			term.term,
			containedTerms,
			parentGroups,
			parentSourceTerm,
		);

		acc[index] = {
			term: term.term,
			groups: term.groups,
			...(term.artificial && { artificial: true }),
			...(subTerms.length > 0 && { subTerms }),
		};

		return acc;
	}, [] as NestedTerm[]);

	return removeDuplicateNestedTerms(nestedTerms);
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

	return nestedTerms.sort((a, b) => b.term.length - a.term.length);
};

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
				? slugify(term.sourceTerm)
				: slugify(term.term);

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

export const enrichDocumentWithUnitex = (
	document: DocumentJson,
	termByGroup: Record<string, TermStatistic[]>,
): DocumentJson => {
	const terms = computeEnrichedTerms(termByGroup);

	const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
	const termRegexes = sortedTerms.map(({ term, groups, subTerms }) => ({
		termRegex: termToRegex(term),
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
