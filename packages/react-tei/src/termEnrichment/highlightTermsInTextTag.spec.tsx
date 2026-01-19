import { describe, expect, it } from "vitest";
import type { DocumentJson } from "../parser/document";
import {
	type HighlightTag,
	highlightTermInString,
	highlightTermInTextTag,
	highlightTermsInTextTag,
	type TermData,
	type TextTag,
} from "./highlightTermsInTextTag";

describe("highlightTermInTextTag", () => {
	describe("highlightTermInString", () => {
		it("should return original fragment in at #text tag if termsRegexp has no match", () => {
			const text = "This is a sample text.";
			const termData: TermData = {
				termRegex: /^search text$/gi,
				term: "search text",
				groups: ["word"],
			};
			const result = highlightTermInString(text, termData);
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: text,
				},
			]);
		});

		it("should highlight single term in text", () => {
			const text = "This is a sample text.";
			const termData: TermData = {
				termRegex: /sample/gi,
				term: "sample",
				groups: ["word"],
			};

			const result = highlightTermInString(text, termData);

			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "sample",
						},
					],
					attributes: { groups: ["word"], term: "sample" },
				},
				{
					tag: "#text",
					value: " text.",
				},
			]);
		});

		it("should highlight all occurrences of a single term in text", () => {
			const text = "This is a sample text for testing called sample.";

			const termData: TermData = {
				termRegex: /sample/gi,
				term: "sample",
				groups: ["group"],
			};
			const result = highlightTermInString(text, termData);
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: [{ tag: "#text", value: "sample" }],
					attributes: { groups: ["group"], term: "sample" },
				},
				{ tag: "#text", value: " text for testing called " },
				{
					tag: "highlight",
					value: [{ tag: "#text", value: "sample" }],
					attributes: { groups: ["group"], term: "sample" },
				},
				{ tag: "#text", value: "." },
			]);
		});

		it("should preserve space between words when highlighting", () => {
			const text = "Highlight  this   term.";
			const termData: TermData = {
				termRegex: /this/gi,
				term: "this",
				groups: ["group"],
			};
			const result = highlightTermInString(text, termData);
			expect(result).toStrictEqual([
				{ tag: "#text", value: "Highlight  " },
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "this",
						},
					],
					attributes: { groups: ["group"], term: "this" },
				},
				{ tag: "#text", value: "   term." },
			]);
		});

		it("should set term in attributes term and keep matched value in value", () => {
			const text = "Testing matching\nTERM with complex regex.";
			const termData: TermData = {
				termRegex: /matching\sterm/gi,
				term: "term",
				groups: ["group"],
			};
			const result = highlightTermInString(text, termData);
			expect(result).toStrictEqual([
				{ tag: "#text", value: "Testing " },
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "matching\nTERM",
						},
					],
					attributes: { groups: ["group"], term: "term" },
				},
				{ tag: "#text", value: " with complex regex." },
			]);
		});
	});

	describe("highlightTermInTextTag", () => {
		it("should highlight terms in mixed fragments", () => {
			const fragments: (TextTag | HighlightTag)[] = [
				{
					tag: "#text",
					value: "This is a sample text.",
				},
				{
					tag: "highlight",
					attributes: {
						term: "sample",
						groups: ["group1"],
					},
					value: [
						{
							tag: "#text",
							value: "This is a sample fragment.",
						},
					],
				} as HighlightTag,
				{ tag: "#text", value: "Another sample here." },
			];
			const termData: TermData = {
				termRegex: /sample/gi,
				term: "sample",
				groups: ["group2"],
			};
			const result = highlightTermInTextTag(fragments, termData);
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "sample",
						},
					],
					attributes: { groups: ["group2"], term: "sample" },
				},
				{
					tag: "#text",
					value: " text.",
				},
				{
					tag: "highlight",
					attributes: {
						term: "sample",
						groups: ["group1"],
					},
					value: [
						{
							tag: "#text",
							value: "This is a sample fragment.",
						},
					],
				},
				{
					tag: "#text",
					value: "Another ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "sample",
						},
					],
					attributes: { groups: ["group2"], term: "sample" },
				},
				{
					tag: "#text",
					value: " here.",
				},
			]);
		});

		it("should highlight terms in string fragments only", () => {
			const fragments: TextTag[] = [
				{
					tag: "#text",
					attributes: {
						term: "sample",
						group: "group1",
					},
					value: "This is a sample text.",
				},
				{
					tag: "#text",
					attributes: {
						term: "example",
						group: "group1",
					},
					value: "Another sample here.",
				},
			];
			const termData: TermData = {
				termRegex: /sample/gi,
				term: "sample",
				groups: ["group2"],
			};
			const result = highlightTermInTextTag(fragments, termData);
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "sample",
						},
					],
					attributes: { groups: ["group2"], term: "sample" },
				},
				{
					tag: "#text",
					value: " text.",
				},
				{
					tag: "#text",
					value: "Another ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "sample",
						},
					],
					attributes: { groups: ["group2"], term: "sample" },
				},
				{
					tag: "#text",
					value: " here.",
				},
			]);
		});

		it("should return empty array when given empty fragments", () => {
			const fragments: (HighlightTag | TextTag)[] = [];
			const termData: TermData = {
				termRegex: /sample/gi,
				term: "sample",
				groups: ["group"],
			};
			const result = highlightTermInTextTag(fragments, termData);
			expect(result).toStrictEqual([]);
		});
	});

	it("should highlight multiple terms in fragments", () => {
		const textTag: TextTag = {
			tag: "#text",
			attributes: {
				lang: "en",
			},
			value: "This is a sample text for testing.",
		};
		const termDataList = [
			{ termRegex: /sample/gi, term: "sample", groups: ["group1"] },
			{ termRegex: /testing/gi, term: "testing", groups: ["group2"] },
			{ termRegex: /example/gi, term: "example", groups: ["group3"] },
		];
		const result = highlightTermsInTextTag(textTag, termDataList);
		expect(result).toStrictEqual({
			tag: "highlightedText",
			attributes: { lang: "en" },
			value: [
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "sample",
						},
					],
					attributes: { groups: ["group1"], term: "sample" },
				},
				{
					tag: "#text",
					value: " text for ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "testing",
						},
					],
					attributes: { groups: ["group2"], term: "testing" },
				},
				{
					tag: "#text",
					value: ".",
				},
			],
		});
	});

	it("highlights nothing when terms are not found", () => {
		const fragments = {
			tag: "#text",
			attributes: {
				lang: "en",
			},
			value: "This is a sample text for testing.",
		};
		const termDataList: TermData[] = [
			{ termRegex: /example/gi, term: "example", groups: ["group1"] },
			{ termRegex: /demo/gi, term: "demo", groups: ["group2"] },
		];
		const result = highlightTermsInTextTag(fragments as any, termDataList);
		expect(result).toStrictEqual({
			tag: "highlightedText",
			attributes: { lang: "en" },
			value: [
				{
					tag: "#text",
					value: "This is a sample text for testing.",
				},
			],
		});
	});

	it("should highlight nothing when given no term", () => {
		const fragments: DocumentJson = {
			tag: "#text",
			attributes: {
				lang: "en",
			},
			value: "This is a sample text for testing.",
		};
		const result = highlightTermsInTextTag(fragments as any, []);
		expect(result).toStrictEqual({
			tag: "highlightedText",
			attributes: { lang: "en" },
			value: [
				{
					tag: "#text",
					attributes: { lang: "en" },
					value: "This is a sample text for testing.",
				},
			],
		});
	});

	it("should preserve space between 2 highlighted terms", () => {
		const fragments: TextTag = {
			tag: "#text",
			value: "Term1  Term2",
		};
		const termDataList: TermData[] = [
			{ termRegex: /Term1/gi, term: "term1", groups: ["group1"] },
			{ termRegex: /Term2/gi, term: "term2", groups: ["group2"] },
		];
		const result = highlightTermsInTextTag(fragments, termDataList);
		expect(result).toStrictEqual({
			tag: "highlightedText",
			attributes: undefined,
			value: [
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "Term1",
						},
					],
					attributes: { groups: ["group1"], term: "term1" },
				},
				{
					tag: "#text",
					value: "  ",
				},
				{
					tag: "highlight",
					value: [
						{
							tag: "#text",
							value: "Term2",
						},
					],
					attributes: { groups: ["group2"], term: "term2" },
				},
			],
		});
	});
});
