import { kebabCasify } from "../helper/kebabCasify";
import type { DocumentJson } from "../parser/document";

export type TextTag = {
	tag: "#text";
	attributes?: Record<string, string>;
	value: string;
} & DocumentJson;

export type HighlightTag = {
	tag: "highlight";
	attributes: {
		groups: string[];
		term: string;
		noAnchor?: boolean;
	};
	value: (TextTag | HighlightTag)[];
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
	groups: string[],
	value: string | (TextTag | HighlightTag)[] | undefined,
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
			tag: "highlight" as const,
			value: value ?? [
				{
					tag: "#text" as const,
					value: matchText,
				},
			],
			attributes: {
				groups,
				term: kebabCasify(matchText),
			},
		} as HighlightTag);

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
	groups: string[],
	value?: string | (TextTag | HighlightTag)[],
): (HighlightTag | TextTag)[] => {
	const stack = [...textFragments];
	const result: (HighlightTag | TextTag)[] = [];

	while (stack.length > 0) {
		const textFragment = stack.shift()!;

		if (textFragment.tag === "highlight") {
			result.push({
				...textFragment,
				value: textFragment.value,
			});
		} else {
			const highlighted = highlightTermInString(
				textFragment.value,
				termRegex,
				groups,
				value,
			);
			result.push(...highlighted);
		}
	}

	return result;
};

type TermRegex = {
	termRegex: RegExp;
	groups: string[];
	value?: (TextTag | HighlightTag)[] | string;
};

export const highlightTermsInTextTag = (
	textTag: TextTag,
	termRegexes: TermRegex[],
): HighlightedTextTag => {
	const value = termRegexes.reduce(
		(textTag: (HighlightTag | TextTag)[], { termRegex, groups, value }) =>
			highlightTermInTextTag(textTag, termRegex, groups, value),
		[textTag] as (HighlightTag | TextTag)[],
	);

	return {
		tag: "highlightedText",
		attributes: textTag.attributes,
		value,
	};
};
