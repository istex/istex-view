import { describe, expect, it } from "vitest";
import type { DocumentJson } from "../parser/document";
import {
	type HighlightTag,
	highlightTermInString,
	highlightTermInTextTag,
	highlightTermsInTextTag,
	type TextTag,
} from "./highlightTermsInTextTag";

describe("highlightTermInTextTag", () => {
	describe("highlightTermInString", () => {
		it("should return original fragment in at #text tag if termsRegexp has no match", () => {
			const text = "This is a sample text.";
			const term: RegExp = /^search text$/gi;
			const result = highlightTermInString(text, term, "word");
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: text,
				},
			]);
		});

		it("should highlight single term in text", () => {
			const text = "This is a sample text.";
			const term: RegExp = /sample/gi;
			const result = highlightTermInString(text, term, "word");

			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: "sample",
					attributes: { group: "word", term: "sample" },
				},
				{
					tag: "#text",
					value: " text.",
				},
			]);
		});

		it("should highlight all occurrences of a single term in text", () => {
			const text = "This is a sample text for testing called sample.";
			const term: RegExp = /sample/gi;
			const result = highlightTermInString(text, term, "group");
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: "sample",
					attributes: { group: "group", term: "sample" },
				},
				{ tag: "#text", value: " text for testing called " },
				{
					tag: "highlight",
					value: "sample",
					attributes: { group: "group", term: "sample" },
				},
				{ tag: "#text", value: "." },
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
						group: "group1",
					},
					value: "This is a sample fragment.",
				},
				{ tag: "#text", value: "Another sample here." },
			];
			const term: RegExp = /sample/gi;
			const result = highlightTermInTextTag(fragments, term, "group2");
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: "sample",
					attributes: { group: "group2", term: "sample" },
				},
				{
					tag: "#text",
					value: " text.",
				},
				{
					tag: "highlight",
					attributes: {
						term: "sample",
						group: "group1",
					},
					value: "This is a sample fragment.",
				},
				{
					tag: "#text",
					value: "Another ",
				},
				{
					tag: "highlight",
					value: "sample",
					attributes: { group: "group2", term: "sample" },
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
			const term: RegExp = /sample/gi;
			const result = highlightTermInTextTag(fragments, term, "group2");
			expect(result).toStrictEqual([
				{
					tag: "#text",
					value: "This is a ",
				},
				{
					tag: "highlight",
					value: "sample",
					attributes: { group: "group2", term: "sample" },
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
					value: "sample",
					attributes: { group: "group2", term: "sample" },
				},
				{
					tag: "#text",
					value: " here.",
				},
			]);
		});

		it("should return empty array when given empty fragments", () => {
			const fragments: (HighlightTag | TextTag)[] = [];
			const term: RegExp = /sample/gi;
			const result = highlightTermInTextTag(fragments, term, "group");
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
		const terms = [
			{ term: "sample", group: "group1" },
			{ term: "testing", group: "group2" },
			{ term: "example", group: "group3" },
		];
		const result = highlightTermsInTextTag(textTag, terms);
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
					value: "sample",
					attributes: { group: "group1", term: "sample" },
				},
				{
					tag: "#text",
					value: " text for ",
				},
				{
					tag: "highlight",
					value: "testing",
					attributes: { group: "group2", term: "testing" },
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
		const terms = [
			{ term: "example", group: "group1" },
			{ term: "demo", group: "group2" },
		];
		const result = highlightTermsInTextTag(fragments as any, terms);
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
});
