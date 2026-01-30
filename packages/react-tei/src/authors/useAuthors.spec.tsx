import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import type { DocumentJson } from "../parser/document";
import { useAuthors } from "./useAuthors";

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
														{
															tag: "author",
															attributes: { "@role": "et-al" },
															value: [
																{
																	tag: "#text",
																	value: "et al.",
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
			{
				tag: "author",
				attributes: { "@role": "et-al" },
				value: [
					{
						tag: "#text",
						value: "et al.",
					},
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

	it("should remove author tags with no value or value is not an array from the result", async () => {
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
	});
});
