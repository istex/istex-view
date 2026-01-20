import { describe, expect, it } from "vitest";
import {
	getOverlappingTermsFromList,
	getTermOverlap,
	getWordOverlap,
} from "./getOverlappingTermsFromList";

describe("getOverlappingTermsFromList", () => {
	describe("getWordOverlap", () => {
		it("should return true for terms that have words intersection (The ends of one is the start of another)", () => {
			const termA = "New York City";
			const termB = "York City University";

			expect(getWordOverlap(termA, termB)).toBe("York City");
		});
		it('should work with longer overlapping parts (e.g., "United States of America" and "States of America and Canada")', () => {
			const termA = "The Great United States of America";
			const termB = "States of America and Canada";

			expect(getWordOverlap(termA, termB)).toBe("States of America");
		});

		it("should return false when there is an intersection but it equal one of the terms", () => {
			const termA = "New York City";
			const termB = "City";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should return false for terms that do not share any common parts", () => {
			const termA = "San Francisco";
			const termB = "Los Angeles";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should return false for identical terms", () => {
			const termA = "Paris";
			const termB = "Paris";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it('should be case sensitive when checking for word intersection (e.g., "Apple" vs "apple")', () => {
			const termA = "Apple Pie";
			const termB = "red apple";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should return false for terms that have substrings that intersects but do not share whole words", () => {
			const termA = "concat";
			const termB = "catastrophic";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it('should take punctuation into account when checking for word intersection (e.g., "end." vs "end")', () => {
			const termA = "The end.";
			const termB = "end of the world";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should take punctuation into account when checking for word intersection", () => {
			const termA = "apple, banana";
			const termB = "banana, kiwi";

			expect(getWordOverlap(termA, termB)).toBe("banana");
		});

		it('should take parentheses into account when checking for word intersection (e.g., "word)" vs "word")', () => {
			expect(getWordOverlap("example (test)", "test case")).toBe(null);
			expect(getWordOverlap("example (test)", "(test) case")).toBe("(test)");
		});
		it("should take brackets into account when checking for word intersection", () => {
			expect(getWordOverlap("data [set]", "set theory")).toBe(null);
			expect(getWordOverlap("data [set]", "[set] theory")).toBe("[set]");
		});

		it('should find no overlap when overlapping part is not a full word" ', () => {
			const termA = "Charles Quint";
			const termB = "Quintessence";
			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it('should find no overlap when overlapping part is not a full word" (with accent)', () => {
			const termA = "écrire";
			const termB = "créé";
			expect(getWordOverlap(termA, termB)).toBe(null);
		});
	});
	describe("getTermOverlap", () => {
		it('should return overlapping term for "Prince Charles" and "Charles Xavier"', () => {
			const termA = {
				group: "group1",
				term: "Prince Charles",
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "Charles Xavier",
				displayed: true,
			};

			const overlappingTerms = getTermOverlap(termA, termB);

			expect(overlappingTerms).toEqual([
				{
					group: "group1+group2",
					artificial: true,
					term: "Prince Charles Xavier",
				},
			]);
		});

		it('should return overlapping term for "United States of America" and "States of America and Canada"', () => {
			const termA = {
				group: "group1",
				term: "United States of America",
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "States of America and Canada",
				displayed: true,
			};

			const overlappingTerms = getTermOverlap(termA, termB);

			expect(overlappingTerms).toEqual([
				{
					group: "group1+group2",
					artificial: true,
					term: "United States of America and Canada",
				},
			]);
		});

		it("should return the same result regardless of the order of terms", () => {
			const termA = {
				group: "group1",
				term: "New York City",
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "York City University",
				displayed: true,
			};
			const overlappingTermsAB = getTermOverlap(termA, termB);
			const overlappingTermsBA = getTermOverlap(termB, termA);
			expect(overlappingTermsAB).toEqual(overlappingTermsBA);
		});

		it("should return an empty array when there is no word overlap", () => {
			const termA = {
				group: "group1",
				term: "Charles Quint",
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "Quintessence",
				displayed: true,
			};
			const overlappingTerms = getTermOverlap(termA, termB);
			expect(overlappingTerms).toEqual([]);
		});

		it("should return an empty array when there is no word overlap (even with accented character)", () => {
			const termA = {
				group: "group1",
				term: "écrire",
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "créé",
				displayed: true,
			};
			const overlappingTerms = getTermOverlap(termA, termB);
			expect(overlappingTerms).toEqual([]);
		});

		it("should return an empty array when there is no word overlap", () => {
			const termA = {
				group: "group1",
				term: "San Francisco",
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "Los Angeles",
				displayed: true,
			};
			const overlappingTerms = getTermOverlap(termA, termB);
			expect(overlappingTerms).toEqual([]);
		});
	});
	it("should find all overlapping terms in a list", () => {
		const terms = [
			{
				group: "group1",
				term: "Prince Charles",
				displayed: true,
			},
			{
				group: "group1",
				term: "Charles Xavier",
				displayed: true,
			},
			{ group: "group1", term: "Wolverine", displayed: true },
			{
				group: "group1",
				term: "Charles the bold",
				displayed: true,
			},
			{
				group: "group1",
				term: "Charles Quint",
			},
			{
				group: "group2",
				term: "bold font",
				displayed: true,
			},
			{
				group: "group2",
				term: "Quintessence",
				displayed: true,
			},
		];
		const overlappingTerms = getOverlappingTermsFromList(terms);

		expect(overlappingTerms).toEqual([
			{
				group: "group1+group1",
				artificial: true,
				term: "Prince Charles Xavier",
			},
			{
				group: "group1+group1",
				artificial: true,
				term: "Prince Charles the bold",
			},
			{
				group: "group1+group1",
				artificial: true,
				term: "Prince Charles Quint",
			},
			{
				group: "group1+group1+group2",
				artificial: true,
				term: "Prince Charles the bold font",
			},
			{
				group: "group1+group2",
				artificial: true,
				term: "Charles the bold font",
			},
		]);
	});

	it("should properly create complex overlaps (more than 2 overlapping)", () => {
		const terms = [
			{
				group: "group1",
				term: "Prince Charles",
				displayed: true,
			},
			{
				group: "group2",
				term: "Charles The Bold",
				displayed: true,
			},
			{
				group: "group3",
				term: "The Bold Font",
				displayed: true,
			},
		];
		const overlappingTerms = getOverlappingTermsFromList(terms);
		expect(overlappingTerms).toEqual([
			{
				group: "group1+group2",
				artificial: true,
				term: "Prince Charles The Bold",
			},
			{
				group: "group1+group2+group3",
				artificial: true,
				term: "Prince Charles The Bold Font",
			},
			{
				group: "group2+group3",
				artificial: true,
				term: "Charles The Bold Font",
			},
		]);
	});
});
