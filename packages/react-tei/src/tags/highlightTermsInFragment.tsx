export const highlightTermInString = (
	text: string,
	termRegex: RegExp,
	group: string,
): (
	| string
	| {
			term: string;
			content: TextFragment[];
			group: string;
	  }
)[] => {
	const matches = Array.from(text.matchAll(termRegex));

	if (!matches.length) {
		return [text];
	}

	const result: TextFragment[] = [];
	let lastIndex = 0;
	matches.forEach((match) => {
		const matchIndex = match.index ?? 0;
		const matchText = match[0];

		// Add text before the match
		if (matchIndex > lastIndex) {
			result.push(text.slice(lastIndex, matchIndex));
		}

		// Add the highlighted term as an object
		result.push({
			term: matchText,
			content: [matchText],
			group,
		});

		// Update lastIndex to the end of the current match
		lastIndex = matchIndex + matchText.length;
	});

	// Add any remaining text after the last match
	if (lastIndex < text.length) {
		result.push(text.slice(lastIndex));
	}

	return result;
};

export type TextFragment =
	| string
	| {
			term: string;
			content: TextFragment[];
			group: string;
	  };

export const highlightTermInFragment = (
	textFragments: TextFragment[],
	termRegex: RegExp,
	group: string,
): TextFragment[] => {
	const [textFragment, ...restFragments] = textFragments;
	if (!textFragment) {
		return [];
	}

	if (typeof textFragment !== "string") {
		return [
			{
				...textFragment,
				content: highlightTermInFragment(
					textFragment.content,
					termRegex,
					group,
				),
			},
			...highlightTermInFragment(restFragments, termRegex, group),
		];
	}

	const highlighted = highlightTermInString(textFragment, termRegex, group);
	return [
		...highlighted,
		...highlightTermInFragment(restFragments, termRegex, group),
	];
};

export const highlightTermsInFragment = (
	textFragments: TextFragment[],
	terms: { term: string; group: string }[],
): TextFragment[] => {
	const sortedTerms = [...terms].sort((a, b) => b.term.length - a.term.length);
	const termRegexes = sortedTerms.map(({ term, group }) => ({
		regex: new RegExp(`\\b${term}\\b`, "gi"),
		group,
	}));

	return termRegexes.reduce(
		(fragments, { regex, group }) =>
			highlightTermInFragment(fragments, regex, group),
		textFragments,
	);
};
