import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document.js";
import { useDocumentIdentifiers } from "./useDocumentIdentifiers";

describe("useDocumentIdentifiers", () => {
	it("should return the analytic idnos tags", async () => {
		const jsonDocument = [
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
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Main Title" }],
															},
															{
																tag: "idno",
																attributes: { "@type": "DOI" },
																value: [
																	{ tag: "#text", value: "10.1000/182/xyz" },
																],
															},
															{
																tag: "idno",
																attributes: { "@type": "ISBN" },
																value: [
																	{ tag: "#text", value: "978-3-16-148410-0" },
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
		];
		const { result } = await renderHook(() => useDocumentIdentifiers(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([
			{
				tag: "idno",
				attributes: { "@type": "DOI" },
				value: [{ tag: "#text", value: "10.1000/182/xyz" }],
			},
			{
				tag: "idno",
				attributes: { "@type": "ISBN" },
				value: [{ tag: "#text", value: "978-3-16-148410-0" }],
			},
		]);
	});
	it("should return an empty array when analytic is missing", async () => {
		const jsonDocument = [
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
												value: [],
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
		const { result } = await renderHook(() => useDocumentIdentifiers(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});
	it("should return an empty array when there are no idnos tag", async () => {
		const jsonDocument = [
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
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Main Title" }],
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
		];
		const { result } = await renderHook(() => useDocumentIdentifiers(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when analytic value is not an array", async () => {
		const jsonDocument = [
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
														value: "This should be an array",
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
		const { result } = await renderHook(() => useDocumentIdentifiers(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when document has no teiHeader", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [],
			},
		];
		const { result } = await renderHook(() => useDocumentIdentifiers(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when document is empty", async () => {
		const jsonDocument: DocumentJson[] = [];
		const { result } = await renderHook(() => useDocumentIdentifiers(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});
});
