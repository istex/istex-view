import { kebabCasify } from "../helper/kebabCasify";
import { termToRegex } from "../helper/termToRegex";
import type { DocumentJson } from "../parser/document";
import { computeEnrichedTerms } from "./computeEnrichedTerms";
import { highlightTermsInChildren } from "./highlightTermsInChildren";
import type { TermStatistic } from "./parseUnitexEnrichment";
import type { TermCountByGroup, TermCountByValue } from "./termCountRegistry";
import type { HighlightTag, NestedTerm, TermData, TextTag } from "./types";

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

export const getTermRegexes = (terms: NestedTerm[]) => {
	return terms.flatMap(({ term, groups, subTerms }) => {
		if (groups.includes("teeft")) {
			if (groups.length > 1) {
				return [
					{
						termRegex: termToRegex(term, true),
						term,
						groups: ["teeft"],
						value: subTerms?.length ? subTerms.map(termToTag) : term,
					},
					{
						termRegex: termToRegex(term, false),
						term,
						groups: groups.filter((g) => g !== "teeft"),
						value: subTerms?.length ? subTerms.map(termToTag) : term,
					},
				];
			}

			return [
				{
					termRegex: termToRegex(term, true),
					term,
					groups: ["teeft"],
					value: subTerms?.length ? subTerms.map(termToTag) : term,
				},
			];
		}
		return [
			{
				termRegex: termToRegex(term),
				term,
				groups,
				value: subTerms?.length ? subTerms.map(termToTag) : term,
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

// Block-level tags that should not allow cross-tag term matching across their boundaries
const BLOCK_TAGS = new Set([
	"p",
	"div",
	"head",
	"list",
	"item",
	"table",
	"row",
	"cell",
	"figure",
	"note",
	"bibl",
	"body",
	"front",
	"back",
	"text",
	"TEI",
	"teiHeader",
	"fileDesc",
	"titleStmt",
	"publicationStmt",
	"sourceDesc",
	"abstract",
]);

/**
 * Check if a node is a block-level element (cannot participate in cross-tag matching)
 */
const isBlockElement = (node: DocumentJson): boolean => {
	return BLOCK_TAGS.has(node.tag);
};

/**
 * Check if a node contains text content (directly or in children)
 */
const containsTextContent = (node: DocumentJson): boolean => {
	if (node.tag === "#text") return true;
	if (Array.isArray(node.value)) {
		return node.value.some(containsTextContent);
	}
	return false;
};

/**
 * Group consecutive inline children together for cross-tag matching.
 * Block elements are kept separate and processed individually.
 * Stop tags (like formula) are kept in the inline group but their text won't be extracted.
 */
const groupInlineChildren = (children: DocumentJson[]): DocumentJson[][] => {
	const groups: DocumentJson[][] = [];
	let currentGroup: DocumentJson[] = [];

	for (const child of children) {
		if (isBlockElement(child)) {
			// Save current group if not empty
			if (currentGroup.length > 0) {
				groups.push(currentGroup);
				currentGroup = [];
			}
			// Block element becomes its own group
			groups.push([child]);
		} else {
			// Inline element, text, or stop tag - add to current group
			// Stop tags will be passed through without text extraction
			currentGroup.push(child);
		}
	}

	// Don't forget the last group
	if (currentGroup.length > 0) {
		groups.push(currentGroup);
	}

	return groups;
};

type EnrichResult = {
	node: DocumentJson;
	registry: TermCountByGroup;
};

/**
 * Recursively enrich a document node with term highlighting.
 * Works at the parent level to enable cross-tag term detection.
 */
const enrichNodeRecursive = (
	node: DocumentJson,
	termCountByGroup: TermCountByGroup,
	termRegexes: TermData[],
): EnrichResult => {
	// Skip stop tags entirely
	if (isStopTag(node)) {
		return { node, registry: termCountByGroup };
	}

	// If this is a text node, it will be handled by its parent
	if (node.tag === "#text") {
		return { node, registry: termCountByGroup };
	}

	// If node has no children array, return as-is
	if (!Array.isArray(node.value)) {
		return { node, registry: termCountByGroup };
	}

	// First, recursively process all block-level children
	const { children: preprocessedChildren, registry: registryAfterPreprocess } =
		node.value.reduce<{ children: DocumentJson[]; registry: TermCountByGroup }>(
			(acc, child) => {
				if (child.tag === "#text") {
					return { children: [...acc.children, child], registry: acc.registry };
				}
				if (isStopTag(child)) {
					return { children: [...acc.children, child], registry: acc.registry };
				}
				if (isBlockElement(child)) {
					const { node: enrichedChild, registry } = enrichNodeRecursive(
						child,
						acc.registry,
						termRegexes,
					);
					return { children: [...acc.children, enrichedChild], registry };
				}
				// For inline elements, recursively process their children but don't do highlighting yet
				// The highlighting will be done at this level to allow cross-tag matching
				return { children: [...acc.children, child], registry: acc.registry };
			},
			{ children: [], registry: termCountByGroup },
		);

	// Group consecutive inline elements together
	const groups = groupInlineChildren(preprocessedChildren);

	// Process each group
	const { resultChildren, registry: finalRegistry } = groups.reduce<{
		resultChildren: DocumentJson[];
		registry: TermCountByGroup;
	}>(
		(acc, group) => {
			// If this group is a single block element, it has already been processed, just return it
			if (
				group.length === 1 &&
				(isBlockElement(group[0]!) || isStopTag(group[0]!))
			) {
				return {
					resultChildren: [...acc.resultChildren, group[0]!],
					registry: acc.registry,
				};
			}

			/// Inline group - apply cross-tag highlighting
			const hasTextContent = group.some(containsTextContent);

			if (!hasTextContent) {
				return {
					resultChildren: [...acc.resultChildren, ...group],
					registry: acc.registry,
				};
			}

			// Apply cross-tag highlighting to this inline group
			const { nodes: highlightedGroup, registry } = highlightTermsInChildren(
				acc.registry,
				group,
				termRegexes,
				isStopTag,
			);

			// Check if highlights were added
			const hasHighlights = highlightedGroup.some(
				(child) => child.tag === "highlight",
			);

			if (hasHighlights) {
				return {
					resultChildren: [
						...acc.resultChildren,
						{
							tag: "highlightedText",
							attributes: undefined,
							value: highlightedGroup,
						} as DocumentJson,
					],
					registry,
				};
			}
			return {
				resultChildren: [...acc.resultChildren, ...highlightedGroup],
				registry,
			};
		},
		{ resultChildren: [], registry: registryAfterPreprocess },
	);

	return {
		node: {
			...node,
			value: resultChildren,
		},
		registry: finalRegistry,
	};
};

export const enrichDocumentWithTerms = (
	document: DocumentJson,
	termByGroup: Record<string, TermStatistic[]>,
): {
	enrichedDocument: DocumentJson;
	termCountByGroup: TermCountByGroup;
} => {
	const termCountByGroup = [...Object.entries(termByGroup)].reduce(
		(acc, [group, terms]) => {
			acc[group] = terms.reduce((acc, { term }) => {
				acc[kebabCasify(term)] = 0;
				return acc;
			}, {} as TermCountByValue);
			return acc;
		},
		{} as TermCountByGroup,
	);

	const terms = computeEnrichedTerms(termByGroup);

	const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
	const termRegexes = getTermRegexes(sortedTerms);

	const { node: enrichedDocument, registry: finalRegistry } =
		enrichNodeRecursive(document, termCountByGroup, termRegexes);

	return {
		enrichedDocument,
		termCountByGroup: finalRegistry,
	};
};
