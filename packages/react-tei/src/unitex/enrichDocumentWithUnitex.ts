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

type EnrichedTerm = {
	term: string;
	group: string;
	subTerms?: EnrichedTerm[];
	artificial?: boolean;
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
				term: prefix!,
				group: termB.group,
			},
			{
				term: wordOverlap,
				group: [termA.group, termB.group].sort().join("+"),
				hybrid: true,
			},
			{
				term: suffix!,
				group: termA.group,
			},
		];
	}
	if (termA.term.endsWith(wordOverlap)) {
		const prefix = termA.term.replace(wordOverlap, "");
		const suffix = termB.term.replace(wordOverlap, "");

		return [
			{
				term: prefix!,
				group: termA.group,
			},
			{
				term: wordOverlap,
				group: [termA.group, termB.group].sort().join("+"),
				hybrid: true,
			},
			{
				term: suffix!,
				group: termB.group,
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
		[
			...termOverLapForFirstTerm.filter((term) => term.hybrid === true),
			...restTerms,
		],
		result.concat(firstTerm, termOverLapForFirstTerm),
	);
};

export const isContainedIn = (
	longer: NormalizedTerm,
	shorter: NormalizedTerm,
): boolean => {
	if (shorter.group === longer.group) return false;
	if (shorter.term === longer.term) return false;
	if (longer.term.includes(shorter.term)) return true;
	return false;
};

export const nestContainedTerms = (terms: NormalizedTerm[]): EnrichedTerm[] => {
	// handle smaller terms first
	const sortedTerms = terms.sort((a, b) => a.term.length - b.term.length);

	return sortedTerms.reduce((acc, term, index) => {
		const containedTerms = acc.filter((otherTerm) =>
			isContainedIn(term, otherTerm),
		);

		if (!containedTerms.length) {
			acc[index] = term;

			return acc;
		}

		acc[index] = {
			term: term.term,
			group: term.group,
			subTerms: containedTerms,
		};

		return acc;
	}, terms as EnrichedTerm[]);
};
// const mergeIdenticalTerms = (
// 	normalized: NormalizedTerm[],
// ): NormalizedTerm[] => {
// 	const merged = new Map<string, NormalizedTerm>();

// 	for (const normalizedTerm of normalized) {
// 		const existing = merged.get(normalizedTerm.term);
// 		if (existing) {
// 			// Merge groups
// 			existing.groups.push(...normalizedTerm.groups);

// 			// Merge subTerms if they exist
// 			if (normalizedTerm.subTerms || existing.subTerms) {
// 				const existingSubTerms = existing.subTerms || [];
// 				const newSubTerms = normalizedTerm.subTerms || [];

// 				// Combine subTerms and recursively merge identical subTerms
// 				const combinedSubTerms = [...existingSubTerms, ...newSubTerms];
// 				existing.subTerms = mergeIdenticalTerms(combinedSubTerms);
// 			}
// 		} else {
// 			merged.set(normalizedTerm.term, { ...normalizedTerm });
// 		}
// 	}

// 	return Array.from(merged.values());
// };

export const computeEnrichedTerms = (
	termByGroup: Record<string, TermStatistic[]>,
): EnrichedTerm[] => {
	const normalizedTerms = normalizeTerms(termByGroup);

	const overlappingTerms = getOverlappingTermsFromList(normalizedTerms);

	const sortedTerms = [...normalizedTerms, ...overlappingTerms].sort(
		(a, b) => b.term.length - a.term.length,
	);

	// const wordTerms: Omit<NormalizedTerm, "words">[] = normalized.flatMap(
	// 	(term) => {
	// 		if (term.words.length > 1) {
	// 			return term.words.map((word) => ({
	// 				term: word,
	// 				group: term.group,
	// 			}));
	// 		}
	// 		return [];
	// 	},
	// );

	// step2: create artificial terms for overlapping terms
	// const hybridGroups: NormalizedTerm[] = normalized.reduce((acc, term) => {
	// 	const existing = acc.find((t) => t.term === term.term);
	// 	if (existing) {
	// 		existing.groups.push(...term.groups);
	// 	} else {
	// 		acc.push({ ...term });
	// 	}
	// 	return acc;
	// }, [] as NormalizedTerm[]);
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
