import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { useDocumentBibliographicReferences } from "./useDocumentBibliographicReferences";

describe("useDocumentBibliographicReferences", () => {
	it("should be return the list of bibl tags in div[type=references]", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "text",
						value: [
							{
								tag: "back",
								value: [
									{
										tag: "div",
										attributes: { "@type": "references" },
										value: [
											{
												tag: "listBibl",
												value: [
													{
														tag: "bibl",
														value: [{ tag: "#text", value: "Reference 1" }],
													},
													{
														tag: "#text",
														value: "Some text",
													},
													{
														tag: "bibl",
														value: [{ tag: "#text", value: "Reference 2" }],
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
		const { result } = await renderHook(
			() => useDocumentBibliographicReferences(),
			{
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				),
			},
		);

		expect(result.current).toStrictEqual({
			bibliographicReferences: [
				{
					tag: "bibl",
					value: [{ tag: "#text", value: "Reference 1" }],
				},
				{
					tag: "bibl",
					value: [{ tag: "#text", value: "Reference 2" }],
				},
			],
			count: 2,
		});
	});
	it("should return an empty array if no div[type=references] found", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "text",
						value: [
							{
								tag: "back",
								value: [
									{
										tag: "div",
										attributes: { "@type": "other-type" },
										value: [
											{
												tag: "listBibl",
												value: [
													{
														tag: "bibl",
														value: [{ tag: "#text", value: "Reference 1" }],
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

		const result = await renderHook(
			() => useDocumentBibliographicReferences(),
			{
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				),
			},
		);

		expect(result.result.current).toStrictEqual({
			bibliographicReferences: [],
			count: 0,
		});
	});

	it("should return an empty array if there is no bibliographic references in the document", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "text",
						value: [
							{
								tag: "back",
								value: [
									{
										tag: "div",
										attributes: { "@type": "references" },
										value: [
											{
												tag: "listBibl",
												value: [
													{
														tag: "note",
														value: [{ tag: "#text", value: "Not a bibl" }],
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
		const result = await renderHook(
			() => useDocumentBibliographicReferences(),
			{
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				),
			},
		);

		expect(result.result.current).toStrictEqual({
			bibliographicReferences: [],
			count: 0,
		});
	});
});
