import { describe, expect, it } from "vitest";
import { extractTextWithPositions } from "./extractTextWithPositions";
import {
	getTextFromHighlightValue,
	reconstructCrossTagNestedTerms,
} from "./reconstructCrossTagNestedTerms";
import type { HighlightTag, TextTag } from "./types";

describe("reconstructCrossTagNestedTerms", () => {
	describe("getTextFromHighlightValue", () => {
		it("should return the string directly when value is a string", () => {
			const result = getTextFromHighlightValue("Hello world");

			expect(result).toBe("Hello world");
		});

		it("should extract text from a simple text node array", () => {
			const value: TextTag[] = [{ tag: "#text", value: "Hello world" }];

			const result = getTextFromHighlightValue(value);

			expect(result).toBe("Hello world");
		});

		it("should concatenate text from multiple text nodes", () => {
			const value: TextTag[] = [
				{ tag: "#text", value: "Hello " },
				{ tag: "#text", value: "world" },
			];

			const result = getTextFromHighlightValue(value);

			expect(result).toBe("Hello world");
		});

		it("should extract text from nested highlight nodes", () => {
			const value: (TextTag | HighlightTag)[] = [
				{
					tag: "highlight",
					value: [{ tag: "#text", value: "Hello " }],
					attributes: {
						groups: ["group1"],
						term: "hello",
					} as HighlightTag["attributes"],
				},
				{
					tag: "highlight",
					value: [{ tag: "#text", value: "world" }],
					attributes: {
						groups: ["group2"],
						term: "world",
					} as HighlightTag["attributes"],
				},
			];

			const result = getTextFromHighlightValue(value);

			expect(result).toBe("Hello world");
		});

		it("should handle deeply nested highlight nodes", () => {
			const value: (TextTag | HighlightTag)[] = [
				{
					tag: "highlight",
					value: [
						{
							tag: "highlight",
							value: [{ tag: "#text", value: "deep" }],
							attributes: {
								groups: ["inner"],
								term: "deep",
							} as HighlightTag["attributes"],
						},
					],
					attributes: {
						groups: ["outer"],
						term: "outer",
					} as HighlightTag["attributes"],
				},
			];

			const result = getTextFromHighlightValue(value);

			expect(result).toBe("deep");
		});

		it("should return empty string for empty array", () => {
			const result = getTextFromHighlightValue([]);

			expect(result).toBe("");
		});
	});

	it("should reconstruct a single subTerm spanning one text node", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const { positions } = extractTextWithPositions(children);

		const nestedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Hello" }],
				attributes: {
					groups: ["group1"],
					term: "hello",
				} as HighlightTag["attributes"],
			},
		];

		const result = reconstructCrossTagNestedTerms(
			children,
			positions,
			0,
			nestedValue,
		);

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "hello" },
		});
		expect((result[0] as HighlightTag).value).toEqual([
			{ tag: "#text", value: "Hello" },
		]);
	});

	it("should reconstruct subTerms spanning across multiple text nodes", () => {
		const children = [
			{ tag: "#text", value: "Prince " },
			{ tag: "#text", value: "Charles" },
		];
		const { positions } = extractTextWithPositions(children);

		const nestedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Prince Charles" }],
				attributes: {
					groups: ["group1"],
					term: "prince-charles",
				} as HighlightTag["attributes"],
			},
		];

		const result = reconstructCrossTagNestedTerms(
			children,
			positions,
			0,
			nestedValue,
		);

		expect(result).toHaveLength(1);
		expect(result[0]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "prince-charles" },
			value: [{ tag: "#text", value: "Prince Charles" }],
		});
	});

	it("should reconstruct subTerms preserving nested tags like <hi>", () => {
		const children = [
			{ tag: "#text", value: "Prince " },
			{
				tag: "hi",
				value: [{ tag: "#text", value: "Charles" }],
			},
		];
		const { positions } = extractTextWithPositions(children);

		const nestedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Prince Charles" }],
				attributes: {
					groups: ["group1"],
					term: "prince-charles",
				} as HighlightTag["attributes"],
			},
		];

		const result = reconstructCrossTagNestedTerms(
			children,
			positions,
			0,
			nestedValue,
		);

		expect(result).toHaveLength(1);
		expect(result[0]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "prince-charles" },
			value: [
				{ tag: "#text", value: "Prince " },
				{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
			],
		});
	});

	it("should reconstruct multiple overlapping subTerms across tags", () => {
		// Document: "Prince <hi>Charles</hi> The <hi>Bold</hi> Font"
		const children = [
			{ tag: "#text", value: "Prince " },
			{
				tag: "hi",
				value: [{ tag: "#text", value: "Charles" }],
			},
			{ tag: "#text", value: " The " },
			{
				tag: "hi",
				value: [{ tag: "#text", value: "Bold" }],
			},
			{ tag: "#text", value: " Font" },
		];
		const { positions } = extractTextWithPositions(children);

		// Overlapping terms: "Prince Charles", "Charles The Bold", "The Bold Font"
		// This is how computeEnrichedTerms would structure them:
		const nestedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Prince " }],
				attributes: {
					groups: ["group1"],
					term: "prince-charles",
				} as HighlightTag["attributes"],
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Charles" }],
				attributes: { groups: ["group1", "group2"], term: null } as any,
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: " " }],
				attributes: { groups: ["group2"], term: "charles-the-bold" },
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "The " }],
				attributes: { groups: ["group2", "group3"], term: null },
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Bold" }],
				attributes: { groups: ["group2", "group3"], term: null },
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: " Font" }],
				attributes: { groups: ["group3"], term: "the-bold-font" },
			},
		];

		const result = reconstructCrossTagNestedTerms(
			children,
			positions,
			0,
			nestedValue,
		);

		expect(result).toHaveLength(6);

		// First subTerm: "Prince "
		expect(result[0]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "prince-charles" },
			value: [{ tag: "#text", value: "Prince " }],
		});

		// Second subTerm: "Charles" (should preserve <hi>)
		expect(result[1]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group1", "group2"], term: null },
			value: [{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] }],
		});

		// Third subTerm: " "
		expect(result[2]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group2"], term: "charles-the-bold" },
			value: [{ tag: "#text", value: " " }],
		});

		// Fourth subTerm: "The "
		expect(result[3]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group2", "group3"], term: null },
			value: [{ tag: "#text", value: "The " }],
		});

		// Fifth subTerm: "Bold" (should preserve <hi>)
		expect(result[4]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group2", "group3"], term: null },
			value: [{ tag: "hi", value: [{ tag: "#text", value: "Bold" }] }],
		});

		// Sixth subTerm: " Font"
		expect(result[5]).toStrictEqual({
			tag: "highlight",
			attributes: { groups: ["group3"], term: "the-bold-font" },
			value: [{ tag: "#text", value: " Font" }],
		});
	});

	it("should handle matchStart offset correctly", () => {
		const children = [{ tag: "#text", value: "Hello Gustave Eiffel" }];
		const { positions } = extractTextWithPositions(children);

		const nestedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Gustave Eiffel" }],
				attributes: {
					groups: ["group1"],
					term: "gustave-eiffel",
				} as HighlightTag["attributes"],
			},
		];

		// Match starts at position 6 ("Gustave Eiffel" starts after "Hello ")
		const result = reconstructCrossTagNestedTerms(
			children,
			positions,
			6,
			nestedValue,
		);

		expect(result).toHaveLength(1);
		expect((result[0] as HighlightTag).value).toEqual([
			{ tag: "#text", value: "Gustave Eiffel" },
		]);
	});

	it("should handle partial text extraction from nested tags", () => {
		const children = [
			{
				tag: "hi",
				value: [{ tag: "#text", value: "Gustave Eiffel" }],
			},
		];
		const { positions } = extractTextWithPositions(children);

		const nestedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Gustave" }],
				attributes: {
					groups: ["group1"],
					term: "gustave",
				} as HighlightTag["attributes"],
			},
		];

		const result = reconstructCrossTagNestedTerms(
			children,
			positions,
			0,
			nestedValue,
		);

		expect(result).toHaveLength(1);
		// Should create a partial structure preserving <hi>
		expect((result[0] as HighlightTag).value).toEqual([
			{ tag: "hi", value: [{ tag: "#text", value: "Gustave" }] },
		]);
	});

	it("should handle empty nestedValue array", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructCrossTagNestedTerms(children, positions, 0, []);

		expect(result).toEqual([]);
	});
});
