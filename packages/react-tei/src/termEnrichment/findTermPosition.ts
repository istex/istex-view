import { escapeRegexChars } from "../helper/termToRegex";

// Find position of a term in container, respecting word boundaries
export const findTermPosition = (
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
