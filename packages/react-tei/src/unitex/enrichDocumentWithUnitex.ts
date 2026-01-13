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

type NormalizedTerm = {
	term: string;
	group: string;
	hybrid?: boolean;
};

// Step 1: Normalize terms from termByGroup into flat list with word arrays
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

export const getWordOverlap = (termA: string, termB: string): string | null => {
	// Edge case: identical terms
	if (termA === termB) return null;

	if (termA.includes(termB) || termB.includes(termA)) {
		return null;
	}

	// Split terms into words
	const wordsA = termA.split(/\s+/).filter(Boolean);

	// Recursive function to test if prefix of termA matches end of termB
	const testPrefixAgainstEnd = (wordIndex: number): string | null => {
		if (wordIndex >= wordsA.length) return null;

		// Build prefix (first wordIndex+1 words of termA)
		const prefixWords = wordsA.slice(0, wordIndex + 1);
		// Clean the last word of prefix by removing non-alphanumeric characters from the end
		const lastWord = prefixWords[prefixWords.length - 1]!;
		const prefix = [...prefixWords.slice(0, -1), lastWord].join(" ");
		const prefixRegex = new RegExp(
			`[^\\p{L}\\p{N}]+${escapeRegexChars(prefix)}$`,
			"u",
		);

		// Check if termB ends with this prefix
		if (termB.match(prefixRegex)) {
			return prefix;
		}

		// Recurse with longer prefix
		return testPrefixAgainstEnd(wordIndex + 1);
	};

	// Recursive function to test if suffix of termA matches start of termB
	const testSuffixAgainstStart = (wordIndex: number): string | null => {
		if (wordIndex < 0) return null;

		// Build suffix (last words from wordIndex to end)
		const suffixWords = wordsA.slice(wordIndex);
		// Clean the first word of suffix by removing non-alphanumeric characters from the start
		const firstWord = suffixWords[0];
		const suffix = [firstWord, ...suffixWords.slice(1)].join(" ");
		const suffixRegex = new RegExp(
			`^${escapeRegexChars(suffix)}[^\\p{L}\\p{N}]+`,
			"u",
		);

		// Check if termB starts with this suffix
		if (termB.match(suffixRegex)) {
			return suffix;
		}

		// Recurse with longer suffix (move index backwards)
		return testSuffixAgainstStart(wordIndex - 1);
	};

	// Test if prefix of termA matches end of termB
	const prefixMatch = testPrefixAgainstEnd(0);
	if (prefixMatch) return prefixMatch;

	const suffixMatch = testSuffixAgainstStart(wordsA.length - 1);
	if (suffixMatch) return suffixMatch;

	return null;
};

export const getTermOverlap = (
	termA: NormalizedTerm,
	termB: NormalizedTerm,
): NormalizedTerm[] => {
	const wordOverlap = getWordOverlap(termA.term, termB.term);
	if (!wordOverlap) return [];

	if (termA.term.startsWith(wordOverlap)) {
		const prefix = termB.term.replace(wordOverlap, "");
		const suffix = termA.term.replace(wordOverlap, "");

		return [
			{
				term: `${prefix}${wordOverlap}${suffix}`,
				group: [termA.group, termB.group].sort().join("+"),
				hybrid: true,
			},
		];
	}
	if (termA.term.endsWith(wordOverlap)) {
		const prefix = termA.term.replace(wordOverlap, "");
		const suffix = termB.term.replace(wordOverlap, "");

		return [
			{
				term: `${prefix}${wordOverlap}${suffix}`,
				group: [termA.group, termB.group].sort().join("+"),
				hybrid: true,
			},
		];
	}
	return [];
};

export const getOverlappingTermsFromList = (
	terms: NormalizedTerm[],
	result: NormalizedTerm[] = [],
): NormalizedTerm[] => {
	if (terms.length <= 1) {
		return result;
	}

	const [firstTerm, ...restTerms] = terms;

	if (!firstTerm || restTerms.length === 0) {
		return result;
	}

	const termOverLapForFirstTerm = restTerms.flatMap((termB) => {
		return getTermOverlap(firstTerm, termB);
	}, []);

	if (termOverLapForFirstTerm.length === 0) {
		return getOverlappingTermsFromList(restTerms, result);
	}

	return getOverlappingTermsFromList(
		[...termOverLapForFirstTerm, ...restTerms],
		result.concat(termOverLapForFirstTerm),
	);
};

type GroupedTerm = {
	term: string;
	groups: string[];
};

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

type NestedTerm = {
	term: string;
	groups: string[];
	subTerms?: NestedTerm[];
	artificial?: boolean;
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

export const hasIdenticalTermInSubTerms = (
	term: NestedTerm,
	subTerms: NestedTerm[],
): boolean => {
	for (const subTerm of subTerms) {
		if (subTerm.term === term.term) {
			return true;
		}
		if (subTerm.subTerms?.length) {
			if (hasIdenticalTermInSubTerms(term, subTerm.subTerms)) {
				return true;
			}
		}
	}
	return false;
};

// remove nestedTerms if they are already present in lower levels
// do this recursively on nested subterms
export const removeDuplicateNestedTerms = (
	terms: NestedTerm[],
): NestedTerm[] => {
	// First, recursively process all subTerms
	const termsWithProcessedSubTerms = terms.map((term) => {
		if (!term.subTerms || !term.subTerms.length) {
			return term;
		}
		return {
			...term,
			subTerms: removeDuplicateNestedTerms(term.subTerms),
		};
	});

	// Then filter out duplicates at this level
	return termsWithProcessedSubTerms.map((term) => {
		if (!term.subTerms || !term.subTerms.length) {
			return term;
		}

		// Filter out subTerms that are already present in any other sibling's nested structure
		const filteredSubTerms = term.subTerms.filter((subTerm, index) => {
			const otherSiblings = [
				...term.subTerms!.slice(0, index),
				...term.subTerms!.slice(index + 1),
			];
			return !hasIdenticalTermInSubTerms(subTerm, otherSiblings);
		});

		return {
			...term,
			subTerms: filteredSubTerms,
		};
	});
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
	// handle smaller terms first
	const sortedTerms = terms.sort((a, b) => a.term.length - b.term.length);

	const nestedTerms = sortedTerms.reduce((acc, term, index) => {
		const containedTerms = acc
			.filter((otherTerm) => isContainedIn(term, otherTerm))
			.map(({ groups, ...rest }) => ({
				...rest,
				groups: groups.filter((g) => !term.groups.includes(g)),
			}));

		if (!containedTerms.length) {
			acc[index] = term;

			return acc;
		}

		// Filter to only keep direct children (terms not contained in other contained terms)
		const directContainedTerms = containedTerms.filter(
			(t) =>
				!containedTerms.some(
					(other) => other.term !== t.term && other.term.includes(t.term),
				),
		);

		const remainingStringParts = getRemainingStringParts(
			[term.term],
			directContainedTerms.map((t) => t.term),
		);

		const subTerms = directContainedTerms
			.concat(
				remainingStringParts.map((term) => ({
					term,
					groups: [],
					artificial: true,
				})),
			)
			.sort((a, b) => term.term.indexOf(a.term) - term.term.indexOf(b.term));

		acc[index] = {
			term: term.term,
			groups: term.groups,
			subTerms,
		};

		return acc;
	}, terms as NestedTerm[]);

	return removeDuplicateNestedTerms(nestedTerms);
};

export const computeEnrichedTerms = (
	termByGroup: Record<string, TermStatistic[]>,
): NestedTerm[] => {
	const normalizedTerms = normalizeTerms(termByGroup);

	// const overlappingTerms = getOverlappingTermsFromList(normalizedTerms);

	const mergedNormalizedTerms = mergeIdenticalTerms(normalizedTerms);

	const nestedTerms = nestContainedTerms(mergedNormalizedTerms);

	return nestedTerms.sort((a, b) => b.term.length - a.term.length);
};

export const enrichDocumentWithUnitex = (
	document: DocumentJson,
	termByGroup: Record<string, TermStatistic[]>,
): DocumentJson => {
	const terms = computeEnrichedTerms(termByGroup);

	const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
	const termRegexes = sortedTerms.map(({ term, groups }) => ({
		termRegex: termToRegex(term),
		groups,
	}));

	const enrichNode = (node: DocumentJson) => {
		if (isTextTag(node)) {
			return highlightTermsInTextTag(node, termRegexes);
		}
		return node;
	};

	return mapTargetTags(document, "#text", enrichNode);
};
