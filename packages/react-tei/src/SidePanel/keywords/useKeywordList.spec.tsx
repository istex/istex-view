import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { isValidKeyword, useKeywordList } from "./useKeywordList";

describe("useKeywordList", () => {
	it('should return an array of keywords found in the document under "teiHeader/profileDesc/textClass/keywords/term"', async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword 1" }],
													},
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword 2" }],
													},
												],
											},
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword A" }],
													},
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword B" }],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		];

		const result = await renderHook(() => useKeywordList(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.result.current).toEqual({
			keywordList: [
				{
					tag: "keywords",
					value: [
						{
							tag: "term",
							value: [{ tag: "#text", value: "Keyword 1" }],
						},
						{
							tag: "term",
							value: [{ tag: "#text", value: "Keyword 2" }],
						},
					],
				},
				{
					tag: "keywords",
					value: [
						{
							tag: "term",
							value: [{ tag: "#text", value: "Keyword A" }],
						},
						{
							tag: "term",
							value: [{ tag: "#text", value: "Keyword B" }],
						},
					],
				},
			],
			count: 4,
		});
	});

	it("should return an empty array if there is no keyword in the document", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [],
			},
		];

		const result = await renderHook(() => useKeywordList(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.result.current).toEqual({ keywordList: [], count: 0 });
	});

	it("should ignore keywords sections with no term children", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "keywords",
												value: [],
											},
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Valid" }],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		];

		const result = await renderHook(() => useKeywordList(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.result.current).toEqual({
			keywordList: [
				{
					tag: "keywords",
					value: [
						{
							tag: "term",
							value: [{ tag: "#text", value: "Keyword Valid" }],
						},
					],
				},
			],
			count: 1,
		});
	});

	it("should ignore keywords sections with invalid attributes", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "keywords",
												attributes: { "@rend": "tocHeading1" },
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Invalid" }],
													},
												],
											},
											{
												tag: "keywords",
												attributes: { "@scheme": "heading" },
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Invalid" }],
													},
												],
											},
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Valid" }],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		] as DocumentJson[];

		const result = await renderHook(() => useKeywordList(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.result.current).toEqual({
			keywordList: [
				{
					tag: "keywords",
					value: [
						{
							tag: "term",
							value: [{ tag: "#text", value: "Keyword Valid" }],
						},
					],
				},
			],
			count: 1,
		});
	});

	describe("isValidKeyword", () => {
		it.each([
			[
				{
					tag: "keywords",
					attributes: {},
					value: [{ tag: "term", value: [] }],
				},
				true,
			],
			[
				{
					tag: "keywords",
					attributes: {},
					value: [
						{
							tag: "list",
							value: [
								{
									tag: "item",
									value: [{ tag: "term", value: [] }],
								},
							],
						},
					],
				},
				true,
			],
			[
				{
					tag: "keywordsWithoutTerm",
					attributes: {},
					value: [
						{
							tag: "list",
							value: [
								{
									tag: "item",
									value: [{ tag: "#text", value: [] }],
								},
							],
						},
						{
							tag: "anotherTag",
							value: [],
						},
					],
				},
				false,
			],
			[
				{
					tag: "notKeywords",
					attributes: {},
					value: [],
				},
				false,
			],
			[
				{
					tag: "keywords",
					attributes: { "@rend": "tocHeading1" },
					value: [],
				},
				false,
			],
			[
				{
					tag: "keywords",
					attributes: { "@scheme": "heading" },
					value: [],
				},
				false,
			],
			[
				{
					tag: "keywords",
					attributes: {},
					value: [],
				},
				false,
			],
		])("should consider %o as valid: %o", (keyword, expectResult) => {
			expect(isValidKeyword(keyword)).toBe(expectResult);
		});
	});
});
