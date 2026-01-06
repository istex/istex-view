import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { BiblStruct, flattenValue, getValueOrder } from "./BiblStruct";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";

describe("BiblStruct", () => {
	describe("flattenValue", () => {
		it("should pluck monogr, analytic and imprint tag replacing them by their value in the documentJson array", () => {
			const input = [
				{
					tag: "analytic",
					value: [
						{
							tag: "title",
							value: [
								{
									tag: "#text",
									value: "The Title",
								},
							],
						},
						{
							tag: "author",
							value: [
								{
									tag: "persName",
									value: [
										{
											tag: "forename",
											value: [
												{
													tag: "#text",
													value: "John",
												},
											],
										},
										{
											tag: "surname",
											value: [
												{
													tag: "#text",
													value: "Doe",
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
					tag: "#text",
					value: "A text",
				},
				{
					tag: "monogr",
					value: [
						{
							tag: "title",
							value: [
								{
									tag: "#text",
									value: "The Source Title",
								},
							],
						},
						{
							tag: "imprint",
							value: [
								{
									tag: "date",
									attributes: { when: "2020" },
								},
								{
									tag: "biblScope",
									attributes: { unit: "vol" },
									value: [
										{
											tag: "#text",
											value: "19",
										},
									],
								},
								{
									tag: "biblScope",
									attributes: { unit: "page", from: "42" },
									value: [
										{
											tag: "#text",
											value: "42",
										},
									],
								},
							],
						},
					],
				},
			];

			const expectedOutput = [
				{
					tag: "title",
					value: [
						{
							tag: "#text",
							value: "The Title",
						},
					],
				},
				{
					tag: "author",
					value: [
						{
							tag: "persName",
							value: [
								{
									tag: "forename",
									value: [
										{
											tag: "#text",
											value: "John",
										},
									],
								},
								{
									tag: "surname",
									value: [
										{
											tag: "#text",
											value: "Doe",
										},
									],
								},
							],
						},
					],
				},
				{
					tag: "#text",
					value: "A text",
				},
				{
					tag: "title",
					value: [
						{
							tag: "#text",
							value: "The Source Title",
						},
					],
				},
				{
					tag: "date",
					attributes: { when: "2020" },
				},
				{
					tag: "biblScope",
					attributes: { unit: "vol" },
					value: [
						{
							tag: "#text",
							value: "19",
						},
					],
				},
				{
					tag: "biblScope",
					attributes: { unit: "page", from: "42" },
					value: [
						{
							tag: "#text",
							value: "42",
						},
					],
				},
			] satisfies DocumentJson[];

			const result = flattenValue(input);
			expect(result).toEqual(expectedOutput);
		});
	});

	it("should return an empty array when input is an empty array", () => {
		const input: DocumentJson[] = [];
		const expectedOutput: DocumentJson[] = [];
		const result = flattenValue(input);
		expect(result).toEqual(expectedOutput);
	});
	it("should return the same array when there is no monogr, analytic or imprint tags", () => {
		const input: DocumentJson[] = [
			{
				tag: "title",
				value: [
					{
						tag: "#text",
						value: "A Title",
					},
				],
			},
			{
				tag: "author",
				value: [
					{
						tag: "persName",
						value: [
							{
								tag: "forename",
								value: [
									{
										tag: "#text",
										value: "Jane",
									},
								],
							},
							{
								tag: "surname",
								value: [
									{
										tag: "#text",
										value: "Smith",
									},
								],
							},
						],
					},
				],
			},
		];
		const result = flattenValue(input);
		expect(result).toEqual(input);
	});

	describe("getValueOrder", () => {
		it.each([
			{ value: { tag: "author" }, expected: 1 },
			{ value: { tag: "date" }, expected: 2 },
			{
				value: {
					tag: "title",
					attributes: {
						"@type": "a",
					},
				},
				expected: 3,
			},
			{
				value: {
					tag: "title",
					attributes: {
						"@type": "nota",
					},
				},
				expected: 6,
			},
			{ value: { tag: "publisher" }, expected: 4 },
			{ value: { tag: "pubPlace" }, expected: 5 },
			{ value: { tag: "biblScope" }, expected: 7 },
			{ value: { tag: "unknownTag" }, expected: 99 },
			{ value: { tag: "#text" }, expected: 99 },
		])("should return correct order for tag $value", ({ value, expected }) => {
			const result = getValueOrder(value);
			expect(result).toBe(expected);
		});
	});

	describe("BiblStruct", () => {
		it("should render the text of tags reordered by flattenValue, separated by colon", async () => {
			const biblStructData: DocumentJson = {
				tag: "biblStruct",
				value: [
					{
						tag: "analytic",
						value: [
							{
								tag: "title",
								attributes: { "@type": "a" },
								value: [
									{
										tag: "#text",
										value: "The final empire",
									},
								],
							},
							{
								tag: "author",
								value: [
									{
										tag: "persName",
										value: [
											{
												tag: "forename",
												value: [
													{
														tag: "#text",
														value: "Brandon",
													},
												],
											},
											{
												tag: "surname",
												value: [
													{
														tag: "#text",
														value: "Sanderson",
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
						tag: "monogr",
						value: [
							{
								tag: "title",
								attributes: { "@type": "m" },
								value: [
									{
										tag: "#text",
										value: "Mistborn",
									},
								],
							},
							{
								tag: "imprint",
								value: [
									{
										tag: "date",
										attributes: { "@when": "2006" },
									},
								],
							},
							{
								tag: "biblScope",
								attributes: { unit: "vol" },
								value: [
									{
										tag: "#text",
										value: "1",
									},
								],
							},
							{
								tag: "biblScope",
								attributes: { unit: "page", from: "2" },
								value: [
									{
										tag: "#text",
										value: "2",
									},
								],
							},
							{
								tag: "biblScope",
								attributes: { unit: "page", to: "647" },
								value: [
									{
										tag: "#text",
										value: "647",
									},
								],
							},
						],
					},
				],
			};

			const screen = await render(<BiblStruct data={biblStructData} />, {
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			});

			expect(screen.container.textContent).toBe(
				"Sanderson Brandon, 2006, The final empire, Mistborn, 1, 2, 647",
			);
		});
	});
});
