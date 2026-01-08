import { describe, expect, it } from "vitest";
import {
	highlightTermInFragment,
	highlightTermInString,
	highlightTermsInFragment,
	type TextFragment,
} from "./highlightTermsInFragment";

describe("highlightTermsInFragment", () => {
	describe("highlightTermInString", () => {
		it("should return original fragment if termsRegexp has no match", () => {
			const text = "This is a sample text.";
			const term: RegExp = /^search text$/gi;
			const result = highlightTermInString(text, term, "word");
			expect(result).toStrictEqual([text]);
		});

		it("should highlight single term in text", () => {
			const text = "This is a sample text.";
			const term: RegExp = /sample/gi;
			const result = highlightTermInString(text, term, "word");

			expect(result).toStrictEqual([
				"This is a ",
				{
					group: "word",
					term: "sample",
					content: ["sample"],
				},
				" text.",
			]);
		});

		it("should highlight all occurrences of a single term in text", () => {
			const text = "This is a sample text for testing called sample.";
			const term: RegExp = /sample/gi;
			const result = highlightTermInString(text, term, "group");
			expect(result).toStrictEqual([
				"This is a ",
				{ group: "group", term: "sample", content: ["sample"] },
				" text for testing called ",
				{ group: "group", term: "sample", content: ["sample"] },
				".",
			]);
		});
	});

	describe("highlightTermInFragment", () => {
		it("should highlight terms in mixed fragments", () => {
			const fragments = [
				"This is a sample text.",
				{
					term: "sample",
					content: ["This is a sample fragment."],
					group: "group1",
				},
				"Another sample here.",
			];
			const term: RegExp = /sample/gi;
			const result = highlightTermInFragment(fragments, term, "group2");
			expect(result).toStrictEqual([
				"This is a ",
				{ group: "group2", term: "sample", content: ["sample"] },
				" text.",
				{
					term: "sample",
					content: [
						"This is a ",
						{ group: "group2", term: "sample", content: ["sample"] },
						" fragment.",
					],
					group: "group1",
				},
				"Another ",
				{ group: "group2", term: "sample", content: ["sample"] },
				" here.",
			]);
		});

		it("should highlight terms in string fragments only", () => {
			const fragments = ["This is a sample text.", "Another sample here."];
			const term: RegExp = /sample/gi;
			const result = highlightTermInFragment(fragments, term, "group2");
			expect(result).toStrictEqual([
				"This is a ",
				{ group: "group2", term: "sample", content: ["sample"] },
				" text.",
				"Another ",
				{ group: "group2", term: "sample", content: ["sample"] },
				" here.",
			]);
		});

		it("should return empty array when given empty fragments", () => {
			const fragments: TextFragment[] = [];
			const term: RegExp = /sample/gi;
			const result = highlightTermInFragment(fragments, term, "group");
			expect(result).toStrictEqual([]);
		});
	});

	it("should highlight multiple terms in fragments", () => {
		const fragments: TextFragment[] = [
			"This is a sample text for testing.",
			"Another example here.",
		];
		const terms = [
			{ term: "sample", group: "group1" },
			{ term: "testing", group: "group2" },
			{ term: "example", group: "group3" },
		];
		const result = highlightTermsInFragment(fragments, terms);
		expect(result).toStrictEqual([
			"This is a ",
			{ group: "group1", term: "sample", content: ["sample"] },
			" text for ",
			{ group: "group2", term: "testing", content: ["testing"] },
			".",
			"Another ",
			{ group: "group3", term: "example", content: ["example"] },
			" here.",
		]);
	});

	it("should handle overlapping terms correctly", () => {
		const fragments: TextFragment[] = ["This is a testing example text."];
		const terms = [
			{ term: "testing", group: "group1" },
			{ term: "example", group: "group2" },
			{ term: "testing example", group: "group3" },
		];
		const result = highlightTermsInFragment(fragments, terms);
		expect(result).toStrictEqual([
			"This is a ",
			{
				group: "group3",
				term: "testing example",
				content: [
					{
						group: "group1",
						term: "testing",
						content: ["testing"],
					},
					" ",
					{
						group: "group2",
						term: "example",
						content: ["example"],
					},
				],
			},
			" text.",
		]);
	});
});
