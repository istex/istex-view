import { mapTargetTags } from "../helper/mapTargetTags";
import { escapeRegexChars, termToRegex } from "../helper/termToRegex";
import type { DocumentJson } from "../parser/document";
import {
	type HighlightTag,
	highlightTermsInTextTag,
	isTextTag,
	type TextTag,
} from "./highlightTermsInTextTag";
import type { TermStatistic } from "./parseUnitexEnrichment";
import { removeDuplicateNestedTerms } from "./removeDuplicateNestedTerms";
import type { NestedTerm } from "./types";

type NormalizedTerm = {
	term: string;
	group: string;
	artificial?: boolean;
};

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
	artificial?: boolean;
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

// Find position of a term in container, respecting word boundaries
const findTermPosition = (
	container: string,
	term: string,
): { start: number; end: number } | null => {
	const regex = new RegExp(
		`(?<![\\p{L}\\p{N}])${escapeRegexChars(term)}(?![\\p{L}\\p{N}])`,
		"u",
	);
	const match = container.match(regex);
	if (!match || match.index === undefined) return null;
	return { start: match.index, end: match.index + term.length };
};

type TermWithPosition = {
	term: NestedTerm;
	start: number;
	end: number;
};

// Group overlapping terms together (terms that share positions are in the same group)
const groupOverlappingTerms = (
	terms: TermWithPosition[],
): TermWithPosition[][] => {
	if (terms.length === 0) return [];

	return terms.reduce<TermWithPosition[][]>((groups, term) => {
		const lastGroup = groups[groups.length - 1];

		if (!lastGroup) {
			// First term starts a new group
			return [[term]];
		}

		const groupEnd = Math.max(...lastGroup.map((t) => t.end));
		if (term.start < groupEnd) {
			// Term overlaps with current group - add to it
			lastGroup.push(term);
		} else {
			// No overlap - start a new group
			groups.push([term]);
		}

		return groups;
	}, []);
};

// Process a single non-overlapping term
const processSingleTerm = (
	termWithPos: TermWithPosition,
	containedTerms: NestedTerm[],
	parentGroups: string[],
): NestedTerm => {
	const termData = termWithPos.term;
	const combinedGroups = [...new Set([...parentGroups, ...termData.groups])];

	// If term has subTerms, recursively update their groups
	let subTerms = termData.subTerms;
	if (subTerms && subTerms.length > 0) {
		subTerms = subTerms.map((st) =>
			propagateGroupsToSubTerm(st, combinedGroups),
		);
	} else {
		// Check if there are smaller contained terms we need to nest
		const smallerContained = containedTerms.filter(
			(ct) =>
				ct.term !== termData.term &&
				findTermPosition(termData.term, ct.term) !== null,
		);
		if (smallerContained.length > 0) {
			// Pass the slugified term as parentSourceTerm for filler segments
			subTerms = splitTermIntoSegments(
				termData.term,
				smallerContained,
				combinedGroups,
				termData.term,
			);
		}
	}

	return {
		term: termData.term,
		groups: combinedGroups,
		...(subTerms && subTerms.length > 0 && { subTerms }),
	};
};

type SubTermAtPosition = {
	subTerm: NestedTerm;
	start: number;
	end: number;
	fromTermGroups: string[];
};

// Build subTerms position map from overlapping terms
const buildSubTermsPositionMap = (
	overlappingGroup: TermWithPosition[],
): SubTermAtPosition[] => {
	return overlappingGroup.flatMap((t) => {
		if (!t.term.subTerms) return [];

		let subPos = t.start;
		return t.term.subTerms.map((st) => {
			const result = {
				subTerm: st,
				start: subPos,
				end: subPos + st.term.length,
				fromTermGroups: t.term.groups,
			};
			subPos += st.term.length;
			return result;
		});
	});
};

// Collect all boundary points from overlapping terms and their subTerms
const collectBoundaries = (overlappingGroup: TermWithPosition[]): number[] => {
	const boundaries = new Set<number>();

	for (const t of overlappingGroup) {
		boundaries.add(t.start);
		boundaries.add(t.end);

		// Add boundaries from subTerms
		if (t.term.subTerms) {
			let subPos = t.start;
			for (const st of t.term.subTerms) {
				boundaries.add(subPos);
				boundaries.add(subPos + st.term.length);
				subPos += st.term.length;
			}
		}
	}

	return Array.from(boundaries).sort((a, b) => a - b);
};

// Compute groups filtering out artificial terms
const computeNonArtificialGroups = (
	coveringTerms: TermWithPosition[],
	parentGroups: string[],
): string[] => {
	// Filter out groups from artificial terms
	const nonArtificialGroups = coveringTerms
		.filter((t) => !t.term.artificial)
		.flatMap((t) => t.term.groups);

	return [...new Set([...parentGroups, ...nonArtificialGroups])].sort();
};

// Compute source term from covering terms
// Returns slugified term if all non-artificial terms have the same term, null otherwise
const computeSourceTerm = (
	coveringTerms: TermWithPosition[],
): string | null => {
	const nonArtificialTerms = coveringTerms.filter((t) => !t.term.artificial);

	if (nonArtificialTerms.length === 0) return null;

	const uniqueTermValues = [
		...new Set(nonArtificialTerms.map((t) => t.term.term)),
	];

	if (uniqueTermValues.length === 1) {
		return uniqueTermValues[0]!;
	}

	return null;
};

// Create a segment from boundary positions
const createSegmentFromBoundary = (
	segStart: number,
	segEnd: number,
	containerTerm: string,
	overlappingGroup: TermWithPosition[],
	allTerms: TermWithPosition[],
	subTermsByPosition: SubTermAtPosition[],
	parentGroups: string[],
): NestedTerm | null => {
	const segmentText = containerTerm.slice(segStart, segEnd);
	if (segmentText === "") return null;

	// Find which terms from the overlapping group cover this segment
	const coveringTermsFromGroup = overlappingGroup.filter(
		(t) => t.start <= segStart && t.end >= segEnd,
	);

	// Find ALL terms that cover this segment (for group computation)
	const allCoveringTerms = allTerms.filter(
		(t) => t.start <= segStart && t.end >= segEnd,
	);

	// Find subTerms that exactly match this segment
	const matchingSubTerms = subTermsByPosition.filter(
		(st) => st.start === segStart && st.end === segEnd,
	);

	if (matchingSubTerms.length > 0) {
		// This segment exactly matches one or more subTerms - merge their properties
		const baseSubTerm = matchingSubTerms[0]!.subTerm;

		// For artificial subTerms (filler text), only use parentGroups
		// For non-artificial subTerms, merge groups from non-artificial covering terms
		const isArtificialSegment = baseSubTerm.artificial;
		const allGroups = isArtificialSegment
			? computeNonArtificialGroups(allCoveringTerms, [])
			: computeNonArtificialGroups(allCoveringTerms, parentGroups);

		// Compute source term (using only the overlapping group for this)
		const sourceTerm = computeSourceTerm(coveringTermsFromGroup);

		// Recursively propagate groups to nested subTerms if any
		let nestedSubTerms = baseSubTerm.subTerms;
		if (nestedSubTerms) {
			nestedSubTerms = nestedSubTerms.map((st) =>
				propagateGroupsToSubTerm(st, allGroups),
			);
		}

		return {
			term: segmentText,
			groups: allGroups,
			sourceTerm,
			...(baseSubTerm.artificial && { artificial: true }),
			...(nestedSubTerms &&
				nestedSubTerms.length > 0 && { subTerms: nestedSubTerms }),
		};
	}

	if (coveringTermsFromGroup.length === 0) {
		// No covering term from the overlapping group - this is filler text
		return {
			term: segmentText,
			groups: parentGroups,
			artificial: true,
		};
	}

	// Covered by terms but no exact subTerm match - create segment from covering terms
	const groups = computeNonArtificialGroups(allCoveringTerms, parentGroups);
	const sourceTerm = computeSourceTerm(coveringTermsFromGroup);

	return {
		term: segmentText,
		groups,
		sourceTerm,
	};
};

// Process multiple overlapping terms into segments
const processOverlappingTerms = (
	overlappingGroup: TermWithPosition[],
	allTerms: TermWithPosition[],
	containerTerm: string,
	parentGroups: string[],
): NestedTerm[] => {
	const sortedBoundaries = collectBoundaries(overlappingGroup);
	const subTermsByPosition = buildSubTermsPositionMap(overlappingGroup);

	// Build segments from consecutive boundary pairs
	const segments: NestedTerm[] = [];
	for (let k = 0; k < sortedBoundaries.length - 1; k++) {
		const segment = createSegmentFromBoundary(
			sortedBoundaries[k]!,
			sortedBoundaries[k + 1]!,
			containerTerm,
			overlappingGroup,
			allTerms,
			subTermsByPosition,
			parentGroups,
		);
		if (segment) {
			segments.push(segment);
		}
	}

	return segments;
};

// Create filler segment for gaps between terms
// Create filler segment for gaps between terms
// sourceTerm is the slugified parent term (for non-artificial parents) or undefined (for artificial parents)
const createFillerSegment = (
	text: string,
	parentGroups: string[],
	sourceTerm?: string,
): NestedTerm => ({
	term: text,
	groups: parentGroups,
	artificial: true,
	...(sourceTerm !== undefined && { sourceTerm }),
});

// Split a container term into ordered subTerms based on contained terms
// Handles N overlapping terms by merging overlapping regions
// parentSourceTerm: for non-artificial parents, the slugified parent term; undefined for artificial parents
export const splitTermIntoSegments = (
	containerTerm: string,
	containedTerms: NestedTerm[],
	parentGroups: string[],
	parentSourceTerm?: string,
): NestedTerm[] => {
	if (containedTerms.length === 0) {
		return [];
	}

	// Step 1: Find positions of all contained terms and filter out those not found
	// Filter out artificial terms - we only want original terms as direct children
	const termsWithPositions: TermWithPosition[] = containedTerms
		.filter((term) => !term.artificial)
		.map((term) => {
			const pos = findTermPosition(containerTerm, term.term);
			return pos ? { term, start: pos.start, end: pos.end } : null;
		})
		.filter((t): t is TermWithPosition => t !== null)
		.sort((a, b) => a.start - b.start);

	if (termsWithPositions.length === 0) {
		return [];
	}

	// Step 2: Filter out terms that are fully contained in other terms
	// Keep only the "direct children" - terms not contained in other found terms
	const directChildren = termsWithPositions.filter((t) => {
		const isContainedInAnother = termsWithPositions.some(
			(other) =>
				other !== t &&
				other.start <= t.start &&
				other.end >= t.end &&
				!(other.start === t.start && other.end === t.end),
		);
		return !isContainedInAnother;
	});

	// Step 3: Group overlapping terms together
	const overlappingGroups = groupOverlappingTerms(directChildren);

	// Step 4: Process each group and build segments with fillers
	const segments: NestedTerm[] = [];
	let currentPos = 0;

	for (const group of overlappingGroups) {
		const groupStart = group[0]!.start;
		const groupEnd = Math.max(...group.map((t) => t.end));

		// Add filler text before this group if any
		if (groupStart > currentPos) {
			segments.push(
				createFillerSegment(
					containerTerm.slice(currentPos, groupStart),
					parentGroups,
					parentSourceTerm,
				),
			);
		}

		if (group.length === 1) {
			// Single term - no overlap
			segments.push(processSingleTerm(group[0]!, containedTerms, parentGroups));
		} else {
			// Multiple overlapping terms - pass all terms for group computation
			segments.push(
				...processOverlappingTerms(
					group,
					termsWithPositions,
					containerTerm,
					parentGroups,
				),
			);
		}

		currentPos = groupEnd;
	}

	// Add any remaining filler text at the end
	if (currentPos < containerTerm.length) {
		segments.push(
			createFillerSegment(
				containerTerm.slice(currentPos),
				parentGroups,
				parentSourceTerm,
			),
		);
	}

	return segments;
};

// Helper to propagate parent groups to a subTerm and its descendants
const propagateGroupsToSubTerm = (
	subTerm: NestedTerm,
	parentGroups: string[],
): NestedTerm => {
	const combinedGroups = [...new Set([...parentGroups, ...subTerm.groups])];
	return {
		...subTerm,
		groups: combinedGroups,
		...(subTerm.subTerms && {
			subTerms: subTerm.subTerms.map((st) =>
				propagateGroupsToSubTerm(st, combinedGroups),
			),
		}),
	};
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
