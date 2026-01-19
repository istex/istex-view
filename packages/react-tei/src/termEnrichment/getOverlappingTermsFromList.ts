import { escapeRegexChars } from "../helper/termToRegex";
import type { NormalizedTerm } from "./types";

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
				artificial: true,
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
				artificial: true,
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
