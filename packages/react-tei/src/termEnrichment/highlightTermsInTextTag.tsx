import { kebabCasify } from "../helper/kebabCasify";
import type { DocumentJson } from "../parser/document";
import {
	incrementTermCountInRegistry,
	type TermCountByGroup,
} from "./termCountRegistry";

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

export type TermData = {
	termRegex: RegExp;
	term: string;
	groups: string[];
	value?: (TextTag | HighlightTag)[] | string;
};

export const isTextTag = (node: DocumentJson): node is TextTag => {
	return node.tag === "#text";
};

export const highlightTermInString = (
	termCountByGroupRegistry: TermCountByGroup,
	text: string,
	termData: TermData,
): (TextTag | HighlightTag)[] => {
	const { termRegex, term, groups, value } = termData;
	const matches = Array.from(text.matchAll(termRegex));

	if (!matches.length) {
		return [
			{
				tag: "#text",
				value: text,
			},
		];
	}

	incrementTermCountInRegistry(
		termCountByGroupRegistry,
		groups.join("+"),
		value,
	);

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
				term: kebabCasify(term),
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
	termCountByGroupRegistry: TermCountByGroup,
	textFragments: (HighlightTag | TextTag)[],
	termData: TermData,
): (HighlightTag | TextTag)[] => {
	const stack = [...textFragments];
	const result: (HighlightTag | TextTag)[] = [];

	while (stack.length > 0) {
		// biome-ignore lint/style/noNonNullAssertion: Stack is not empty here
		const textFragment = stack.shift()!;

		if (textFragment.tag === "highlight") {
			result.push({
				...textFragment,
				value: textFragment.value,
			});
		} else {
			const highlighted = highlightTermInString(
				termCountByGroupRegistry,
				textFragment.value,
				termData,
			);
			result.push(...highlighted);
		}
	}

	return result;
};

export const highlightTermsInTextTag = (
	termCountByGroupRegistry: TermCountByGroup,
	textTag: TextTag,
	termDataList: TermData[],
): HighlightedTextTag => {
	const value = termDataList.reduce(
		(textTag: (HighlightTag | TextTag)[], termData) =>
			highlightTermInTextTag(termCountByGroupRegistry, textTag, termData),
		[textTag] as (HighlightTag | TextTag)[],
	);

	return {
		tag: "highlightedText",
		attributes: textTag.attributes,
		value,
	};
};
