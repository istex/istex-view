export const escapeRegexChars = (str: string): string => {
	return str
		.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		.replaceAll("-", "[-–]")
		.replaceAll(/\s/g, "\\s");
};

export const termToRegex = (term: string): RegExp => {
	const escapedTerm = escapeRegexChars(term);
	return new RegExp(
		`(?<![\\p{L}\\p{N}])${escapedTerm}(?![\\p{L}\\p{N}])`,
		"gu",
	);
};
