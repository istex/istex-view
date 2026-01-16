import { describe, expect, it } from "vitest";
import { termToRegex } from "./termToRegex";

describe("termToRegex", () => {
	it.each([
		{ term: "test", text: "this is a test", expected: true },
		{ term: "test", text: "testing", expected: false },
		{ term: "test", text: "a test!", expected: true },
		{ term: "test", text: "pretest posttest", expected: false },
		{ term: "café", text: "I love café culture", expected: true },
		{ term: "cafe", text: "I love café culture", expected: false },
		{ term: "café", text: "I love cafe culture", expected: false },
		{ term: "café", text: "caféteria", expected: false },
		{ term: "naïve", text: "a naïve approach", expected: true },
		{ term: "naïve", text: "naïveté is common", expected: false },
		{ term: "The", text: "The quick brown fox", expected: true },
		{ term: "The", text: "devil the is in the details", expected: false },
		{ term: "the", text: "rather", expected: false },
		{ term: "1945", text: "In 1945, the war ended.", expected: true },
		{ term: "1945", text: "71945", expected: false },
		{ term: "1945", text: "19457", expected: false },
		{ term: "1945", text: "819457", expected: false },
		{
			term: "1945",
			text: "At the end of the war (1945) it happened",
			expected: true,
		},
		{
			term: "dev@marmelab.com",
			text: "Contact : dev@marmelab.com",
			expected: true,
		},
		{
			term: "c",
			text: "Languages: c, JavaScript, Typescript...",
			expected: true,
		},
		{
			term: "1920, 1921",
			text: "Between 1920, 1921 and 1922, many events happened.",
			expected: true,
		},
		{
			term: "1920 and 1921",
			text: "Between 1920 and\n1921, many events happened.",
			expected: true,
		},
		{
			term: "1920 and 1921",
			// with non-breaking space
			text: "Between 1920\u00A0and\u00A01921, many events happened.",
			expected: true,
		},
		{
			term: "1920 and 1921",
			// with tabs
			text: "Between 1920	and	1921, many events happened.",
			expected: true,
		},
	])("should return $expected when trying to match term: $term on text: $text", ({
		term,
		text,
		expected,
	}) => {
		const regex = termToRegex(term);
		expect(regex.test(text)).toBe(expected);
	});

	it("should match on every occurrence of a term in a text", () => {
		const term = "test";
		const text = "this is a test. Testing the test cases for a test!";
		const regex = termToRegex(term);
		const matches = Array.from(text.matchAll(regex));
		// matches item are not literal object, so we check their properties directly
		expect(matches).toHaveLength(3);
		expect(matches[0]?.[0]).toBe("test");
		expect(matches[0]?.index).toBe(10);
		expect(matches[1]?.[0]).toBe("test");
		expect(matches[1]?.index).toBe(28);
		expect(matches[2]?.[0]).toBe("test");
		expect(matches[2]?.index).toBe(45);
	});
});
