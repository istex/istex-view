import { describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider.js";
import { useDocumentSources } from "./useDocumentSources.js";

describe("useDocumentSources", () => {
	it("should return the main and sub title", async () => {
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
														tag: "monogr",
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
																tag: "title",
																attributes: {
																	"@type": "sub",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Sub Title" }],
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([
			{
				tag: "title",
				attributes: {
					"@type": "main",
					"@level": "m",
				},
				value: [{ tag: "#text", value: "Main Title" }],
			},
			{
				tag: "title",
				attributes: {
					"@type": "sub",
					"@level": "m",
				},
				value: [{ tag: "#text", value: "Sub Title" }],
			},
		]);
	});

	it("should return only the main title when no subtitle is present", async () => {
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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: [
																	{ tag: "#text", value: "Main Title Only" },
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([
			{
				tag: "title",
				attributes: {
					"@type": "main",
					"@level": "m",
				},
				value: [{ tag: "#text", value: "Main Title Only" }],
			},
		]);
	});

	it('should ignore titles that are not of type "main" or "sub"', async () => {
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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "other",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Other Title" }],
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it('should ignore titles that do not have level "m" or "j"', async () => {
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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "x",
																},
																value: [
																	{
																		tag: "#text",
																		value: "Invalid Level Title",
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
				],
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when monogr is missing", async () => {
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});
	it("should return an empty array when there are no titles", async () => {
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
														tag: "monogr",
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
				],
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when monogr value is not an array", async () => {
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
														tag: "monogr",
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
		const { result } = await renderHook(() => useDocumentSources(), {
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when document is empty", async () => {
		const jsonDocument: any[] = [];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when there is a subtitle but no main title", async () => {
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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "sub",
																	"@level": "m",
																},
																value: [
																	{ tag: "#text", value: "Only Sub Title" },
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});
		expect(result.current).toEqual([]);
	});

	it("should warn when multiple main titles are found", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: [
																	{ tag: "#text", value: "Main Title 1" },
																],
															},
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: [
																	{ tag: "#text", value: "Main Title 2" },
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
		await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Multiple main titles found in document monogr",
			expect.objectContaining({
				mainTitles: expect.any(Array),
			}),
		);

		consoleWarnSpy.mockRestore();
	});

	it("should warn when multiple sub titles are found", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "sub",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Sub Title 1" }],
															},
															{
																tag: "title",
																attributes: {
																	"@type": "sub",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Sub Title 2" }],
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
		await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Multiple sub titles found in document monogr",
			expect.objectContaining({
				subTitles: expect.any(Array),
			}),
		);

		consoleWarnSpy.mockRestore();
	});

	it("should ignore titles that do not have value as an array", async () => {
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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: "This should be an array",
															},
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: 42,
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={invalidJsonDocument as any}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should ignore titles that have empty value arrays", async () => {
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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
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
						],
					},
				],
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={invalidJsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return first main and sub titles when multiple valid ones are present", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
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
														tag: "monogr",
														value: [
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: [
																	{ tag: "#text", value: "Main Title 1" },
																],
															},
															{
																tag: "title",
																attributes: {
																	"@type": "main",
																	"@level": "m",
																},
																value: [
																	{ tag: "#text", value: "Main Title 2" },
																],
															},
															{
																tag: "title",
																attributes: {
																	"@type": "sub",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Sub Title 1" }],
															},
															{
																tag: "title",
																attributes: {
																	"@type": "sub",
																	"@level": "m",
																},
																value: [{ tag: "#text", value: "Sub Title 2" }],
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
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={jsonDocument}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(result.current).toEqual([
			{
				tag: "title",
				attributes: {
					"@type": "main",
					"@level": "m",
				},
				value: [{ tag: "#text", value: "Main Title 1" }],
			},
			{
				tag: "title",
				attributes: {
					"@type": "sub",
					"@level": "m",
				},
				value: [{ tag: "#text", value: "Sub Title 1" }],
			},
		]);

		expect(consoleWarnSpy).toHaveBeenCalledTimes(2);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Multiple main titles found in document monogr",
			expect.objectContaining({
				mainTitles: expect.any(Array),
			}),
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Multiple sub titles found in document monogr",
			expect.objectContaining({
				subTitles: expect.any(Array),
			}),
		);

		consoleWarnSpy.mockRestore();
	});
});
