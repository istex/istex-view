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
	artificial?: boolean;
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
		// Skip artificial terms - they are allowed to be duplicated
		const filteredSubTerms = term.subTerms.filter((subTerm, index) => {
			// Don't filter artificial terms
			if (subTerm.artificial) return true;

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

		// Filter to only keep direct children
		// A term is a direct child if:
		// 1. It's not contained in another contained term that is itself a direct child
		// 2. When two terms overlap, prefer the smaller atomic terms
		const directContainedTerms = containedTerms.filter((t) => {
			// Check if this term is contained in another contained term
			const containerTerms = containedTerms.filter(
				(other) => other.term !== t.term && other.term.includes(t.term),
			);

			if (containerTerms.length === 0) return true; // Not contained in anything, keep it

			// This term is contained in other terms
			// Check if we should keep the smaller term or the larger term
			// We should keep the smaller term if:
			// - There are other smaller terms that cover the remaining parts of the container
			for (const container of containerTerms) {
				// Find other small terms that are also in this container
				const otherSmallTermsInContainer = containedTerms.filter(
					(other) =>
						other.term !== t.term &&
						other.term.length <= t.term.length &&
						container.term.includes(other.term),
				);

				// If there are other small terms that together with t cover parts of the container,
				// then we should keep t (and filter out the container)
				if (otherSmallTermsInContainer.length > 0) {
					return true;
				}
			}

			return false; // This term should be filtered out, we'll use the container instead
		});

		// Now filter out containers if their parts are already covered by smaller terms
		const finalContainedTerms = directContainedTerms.filter((t) => {
			// Check if all parts of this term are covered by smaller direct contained terms
			const smallerTermsInside = directContainedTerms.filter(
				(other) => other.term !== t.term && t.term.includes(other.term),
			);

			// If smaller terms exist inside this term, filter it out
			return smallerTermsInside.length === 0;
		});

		// For each final term, add groups from container terms that were filtered out
		const enrichedContainedTerms = finalContainedTerms.map((t) => {
			// Find container terms that were filtered out
			const filteredContainers = containedTerms.filter(
				(container) =>
					container.term !== t.term &&
					container.term.includes(t.term) &&
					!finalContainedTerms.some((f) => f.term === container.term),
			);

			// Add their groups to this term
			const additionalGroups = filteredContainers.flatMap((c) => c.groups);
			const mergedGroups = [
				...new Set([...t.groups, ...additionalGroups]),
			].sort();

			return {
				...t,
				groups: mergedGroups,
			};
		});

		// If we filtered out overlapping terms but there are still overlapping terms remaining,
		// we need to extract the overlap manually
		let processedTerms: NestedTerm[] = enrichedContainedTerms as NestedTerm[];

		if (
			enrichedContainedTerms.length >= 2 &&
			directContainedTerms.length === enrichedContainedTerms.length
		) {
			// No terms were filtered, check if we need to handle overlaps
			const [first, second] = enrichedContainedTerms;
			if (first && second) {
				const overlap = getWordOverlap(first.term, second.term);
				if (overlap) {
					// Extract the overlap manually
					const mergedGroups = [
						...new Set([...first.groups, ...second.groups]),
					];
					const firstIndex = term.term.indexOf(first.term);
					const secondIndex = term.term.indexOf(second.term);

					let prefix: string;
					let suffix: string;

					if (firstIndex < secondIndex) {
						prefix = first.term.replace(overlap, "");
						suffix = second.term.replace(overlap, "");
					} else {
						prefix = second.term.replace(overlap, "");
						suffix = first.term.replace(overlap, "");
					}

					processedTerms = [
						...(prefix ? [{ term: prefix, groups: mergedGroups }] : []),
						{ term: overlap, groups: mergedGroups },
						...(suffix ? [{ term: suffix, groups: mergedGroups }] : []),
					];
				}
			}
		}

		const remainingStringParts = getRemainingStringParts(
			[term.term],
			processedTerms.map((t) => t.term),
		);

		// Build subTerms in correct order by reconstructing the string
		const allParts = [
			...processedTerms,
			...remainingStringParts.map((t) => ({
				term: t,
				groups: [] as string[],
				artificial: true,
			})),
		];

		// Sort by finding each term's position in order using recursion
		const buildSubTermsInOrder = (
			remainingStr: string,
			availableParts: NestedTerm[],
			result: NestedTerm[] = [],
		): NestedTerm[] => {
			if (remainingStr.length === 0 || availableParts.length === 0) {
				return result;
			}

			const matchingPartIndex = availableParts.findIndex((part) =>
				remainingStr.startsWith(part.term),
			);

			if (matchingPartIndex === -1) {
				// No matching part found, this shouldn't happen
				return result;
			}

			const matchingPart = availableParts[matchingPartIndex] as NestedTerm;
			const newRemainingStr = remainingStr.slice(matchingPart.term.length);
			const newAvailableParts = availableParts.filter(
				(_, i) => i !== matchingPartIndex,
			);

			return buildSubTermsInOrder(newRemainingStr, newAvailableParts, [
				...result,
				matchingPart,
			]);
		};

		const subTerms = buildSubTermsInOrder(term.term, allParts);

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

	const overlappingTerms = getOverlappingTermsFromList(normalizedTerms);

	const mergedNormalizedTerms = mergeIdenticalTerms(
		normalizedTerms.concat(overlappingTerms),
	);

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
