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
		group: string[];
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
	group: string[],
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
			value: [
				{
					tag: "#text" as const,
					value: matchText,
				},
			],
			attributes: {
				group,
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
	group: string[],
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
				group,
			);
			result.push(...highlighted);
		}
	}

	return result;
};

export const highlightTermsInTextTag = (
	textTag: TextTag,
	termRegexes: { termRegex: RegExp; group: string[] }[],
): HighlightedTextTag => {
	const value = termRegexes.reduce(
		(textTag: (HighlightTag | TextTag)[], { termRegex, group }) =>
			highlightTermInTextTag(textTag, termRegex, group),
		[textTag] as (HighlightTag | TextTag)[],
	);

	return {
		tag: "highlightedText",
		attributes: textTag.attributes,
		value,
	};
};
