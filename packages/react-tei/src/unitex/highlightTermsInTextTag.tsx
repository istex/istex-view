import type { DocumentJson } from "../parser/document";

export type TextTag = {
	tag: "#text";
	attributes?: Record<string, string>;
	value: string;
} & DocumentJson;

export type HighlightTag = {
	tag: "highlight";
	attributes: Record<string, string>;
	value: string;
} & DocumentJson;

export type HighlightedTextTag = {
	tag: "highlightedText";
	attributes?: Record<string, string>;
	value: (HighlightTag | TextTag)[];
} & DocumentJson;

export const isTextTag = (node: DocumentJson): node is TextTag => {
	return node.tag === "#text";
};

export const highlightTermInString = (
	text: string,
	termRegex: RegExp,
	group: string,
): (TextTag | HighlightTag)[] => {
	const matches = Array.from(text.matchAll(termRegex));

	if (!matches.length) {
		return [
			{
				tag: "#text",
				value: text,
			},
		];
	}

	const result: (HighlightTag | TextTag)[] = [];
	let lastIndex = 0;
	matches.forEach((match) => {
		const matchIndex = match.index ?? 0;
		const matchText = match[0];

		// Add text before the match
		if (matchIndex > lastIndex) {
			const precedingText = text.slice(lastIndex, matchIndex);
			result.push({
				tag: "#text",
				value: precedingText,
			});
		}

		// Add the highlighted term as an object
		result.push({
			tag: "highlight",
			value: matchText,
			attributes: {
				group,
				term: matchText,
			},
		});

		// Update lastIndex to the end of the current match
		lastIndex = matchIndex + matchText.length;
	});

	// Add any remaining text after the last match
	if (lastIndex < text.length) {
		const afterText = text.slice(lastIndex);
		result.push({
			tag: "#text",
			value: afterText,
		});
	}

	return result;
};

export const highlightTermInTextTag = (
	textFragments: (HighlightTag | TextTag)[],
	termRegex: RegExp,
	group: string,
): (HighlightTag | TextTag)[] => {
	const [textFragment, ...restFragments] = textFragments;
	if (!textFragment) {
		return [];
	}

	if (textFragment.tag === "highlight") {
		return [
			{
				...textFragment,
				value: textFragment.value,
			},
			...highlightTermInTextTag(restFragments, termRegex, group),
		];
	}

	const highlighted = highlightTermInString(
		textFragment.value,
		termRegex,
		group,
	);
	return [
		...highlighted,
		...highlightTermInTextTag(restFragments, termRegex, group),
	];
};

export const highlightTermsInTextTag = (
	textTag: TextTag,
	terms: { term: string; group: string }[],
): HighlightedTextTag => {
	const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
	const termRegexes = sortedTerms.map(({ term, group }) => ({
		regex: new RegExp(`\\b${term}\\b`, "gi"),
		group,
	}));

	const value = termRegexes.reduce(
		(textTag: (HighlightTag | TextTag)[], { regex, group }) =>
			highlightTermInTextTag(textTag, regex, group),
		[textTag] as (HighlightTag | TextTag)[],
	);

	return {
		tag: "highlightedText",
		attributes: textTag.attributes,
		value,
	};
};
