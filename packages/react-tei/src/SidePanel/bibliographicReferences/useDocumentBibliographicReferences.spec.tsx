import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { useDocumentBibliographicReferences } from "./useDocumentBibliographicReferences";

const queryClient = new QueryClient();

function TestWrapper({
	jsonDocument,
	children,
}: {
	jsonDocument: DocumentJson[];
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				{children}
			</DocumentContextProvider>
		</QueryClientProvider>
	);
}

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
					<TestWrapper jsonDocument={jsonDocument}>{children}</TestWrapper>
				),
			},
		);

		expect(result.current).toStrictEqual([
			{
				tag: "bibl",
				value: [{ tag: "#text", value: "Reference 1" }],
			},
			{
				tag: "bibl",
				value: [{ tag: "#text", value: "Reference 2" }],
			},
		]);
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
					<TestWrapper jsonDocument={jsonDocument}>{children}</TestWrapper>
				),
			},
		);

		expect(result.result.current).toStrictEqual([]);
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
					<TestWrapper jsonDocument={jsonDocument}>{children}</TestWrapper>
				),
			},
		);

		expect(result.result.current).toStrictEqual([]);
	});
});
