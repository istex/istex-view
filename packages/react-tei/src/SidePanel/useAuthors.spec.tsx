import { describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider.js";
import type { DocumentJson } from "../parser/document.js";
import { useAuthors } from "./useAuthors.js";

describe("useAuthors", () => {
	const jsonDocument = [
		{
			tag: "TEI",
			value: [
				{
					tag: "teiHeader",
					value: [
						{
							tag: "encodingDesc",
							value: [
								{
									tag: "projectDesc",
									value: [
										{
											tag: "p",
											value: "Some encoding description",
										},
									],
								},
							],
						},
						{
							tag: "fileDesc",
							value: [
								{
									tag: "sourceDesc",
									value: [
										{
											tag: "biblStruct",
											value: [
												{
													tag: "analytic",
													value: [
														{
															tag: "author",
															value: [
																{ tag: "persName", value: "Author Name" },
																{ tag: "#text", value: "Some text" },
																{
																	tag: "affiliation",
																	value: "First author affiliation",
																},
															],
														},
														{
															tag: "author",
															value: [
																{ tag: "persName", value: "Second Author" },
																{
																	tag: "affiliation",
																	value: "Second author affiliation",
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
						{
							tag: "profileDesc",
							value: [
								{
									tag: "abstract",
									value: [{ tag: "p", value: "Abstract content" }],
								},
							],
						},
					],
				},
			],
		},
	];

	it("should return authors from the document cleaning up #text tag from author value", async () => {
		const result = await renderHook(() => useAuthors(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.result.current).toEqual([
			{
				tag: "author",
				value: [
					{ tag: "persName", value: "Author Name" },
					{ tag: "affiliation", value: "First author affiliation" },
				],
			},
			{
				tag: "author",
				value: [
					{ tag: "persName", value: "Second Author" },
					{ tag: "affiliation", value: "Second author affiliation" },
				],
			},
		]);
	});

	it("should return an empty array if no analytic tag is found", async () => {
		const emptyJsonDocument = [
			{
				tag: "TEI",
				value: [],
			},
		];

		const result = await renderHook(() => useAuthors(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={emptyJsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.result.current).toEqual([]);
	});

	it("should log a warning if an author tag has no value or value is not an array and remove it form result", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const invalidJsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "fileDesc",
								value: [
									{
										tag: "sourceDesc",
										value: [
											{
												tag: "biblStruct",
												value: [
													{
														tag: "analytic",
														value: [
															{
																tag: "author",
																value: null,
															},
															{
																tag: "author",
																value: "Just a string value",
															},
															{
																tag: "author",
																value: [
																	{ tag: "persName", value: "Valid Author" },
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
						],
					},
				],
			},
		] as DocumentJson[];

		const result = await renderHook(() => useAuthors(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={invalidJsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.result.current).toEqual([
			{
				tag: "author",
				value: [{ tag: "persName", value: "Valid Author" }],
			},
		]);
		expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Author tag has no value or value is not an array",
			{
				author: {
					tag: "author",
					value: null,
				},
			},
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Author tag has no value or value is not an array",
			{
				author: {
					tag: "author",
					value: "Just a string value",
				},
			},
		);

		consoleWarnSpy.mockRestore();
	});
});
