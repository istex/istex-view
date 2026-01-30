import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentJson } from "../../parser/document.js";
import { useDocumentSources } from "./useDocumentSources";

interface TestWrapperProps {
	children: ReactNode;
	jsonDocument: DocumentJson[];
}

function TestWrapper({ children, jsonDocument }: TestWrapperProps) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				{children}
			</DocumentContextProvider>
		</I18nProvider>
	);
}

function TestWrapperWithPartialDocument({
	children,
	jsonDocument,
}: TestWrapperProps) {
	const fullDocument = [
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
											value: jsonDocument,
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
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={fullDocument}>
				{children}
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("useDocumentSources", () => {
	it("should return the main and sub title", async () => {
		const jsonDocument = [
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
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
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
				tag: "#text",
				value: " : ",
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
				tag: "monogr",
				value: [
					{
						tag: "title",
						attributes: {
							"@type": "main",
							"@level": "m",
						},
						value: [{ tag: "#text", value: "Main Title Only" }],
					},
				],
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
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
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});

		expect(result.current).toEqual([]);
	});

	it('should ignore titles that do not have level "m" or "j"', async () => {
		const jsonDocument = [
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
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when monogr is missing", async () => {
		const jsonDocument: DocumentJson[] = [];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});

		expect(result.current).toEqual([]);
	});
	it("should return an empty array when there are no titles", async () => {
		const jsonDocument = [
			{
				tag: "monogr",
				value: [],
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when monogr value is not an array", async () => {
		const jsonDocument = [
			{
				tag: "monogr",
				value: "This should be an array",
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
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
				<TestWrapper jsonDocument={jsonDocument}>{children}</TestWrapper>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when document is empty", async () => {
		const jsonDocument: DocumentJson[] = [];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={jsonDocument}>{children}</TestWrapper>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return an empty array when there is a subtitle but no main title", async () => {
		const jsonDocument = [
			{
				tag: "monogr",
				value: [
					{
						tag: "title",
						attributes: {
							"@type": "sub",
							"@level": "m",
						},
						value: [{ tag: "#text", value: "Only Sub Title" }],
					},
				],
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});
		expect(result.current).toEqual([]);
	});

	it("should ignore titles that do not have value as an array", async () => {
		const invalidJsonDocument: DocumentJson[] = [
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
						value: "42",
					},
				],
			},
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={invalidJsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should ignore titles that have empty value arrays", async () => {
		const invalidJsonDocument = [
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
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={invalidJsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});

		expect(result.current).toEqual([]);
	});

	it("should return first main and sub titles when multiple valid ones are present", async () => {
		const jsonDocument = [
			{
				tag: "monogr",
				value: [
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
							"@type": "main",
							"@level": "m",
						},
						value: [{ tag: "#text", value: "Main Title 2" }],
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
		];
		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
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
				tag: "#text",
				value: " : ",
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
	});

	it("shoudl return imprint when present", async () => {
		const jsonDocument = [
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
						tag: "imprint",
						value: [
							{
								tag: "publisher",
								value: [{ tag: "#text", value: "Publisher Name" }],
							},
							{
								tag: "date",
								attributes: { "@when": "2023-06" },
								value: [{ tag: "#text", value: "2023-06" }],
							},
							{
								tag: "biblScope",
								attributes: { "@unit": "volume" },
								value: [{ tag: "#text", value: "42" }],
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
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
				tag: "imprint",
				value: [
					{
						tag: "publisher",
						value: [{ tag: "#text", value: "Publisher Name" }],
					},
					{
						tag: "date",
						attributes: { "@when": "2023-06" },
						value: [{ tag: "#text", value: "2023-06" }],
					},
					{
						tag: "biblScope",
						attributes: { "@unit": "volume" },
						value: [{ tag: "#text", value: "42" }],
					},
				],
			},
		]);
	});

	it("should return both idno and imprint when present", async () => {
		const jsonDocument = [
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
						tag: "idno",
						attributes: { "@type": "eISBN" },
						value: [{ tag: "#text", value: "123-456-789" }],
					},
					{
						tag: "imprint",
						value: [
							{
								tag: "publisher",
								value: [{ tag: "#text", value: "Publisher Name" }],
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
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
				tag: "imprint",
				value: [
					{
						tag: "publisher",
						value: [{ tag: "#text", value: "Publisher Name" }],
					},
				],
			},
			{
				tag: "idno",
				attributes: { "@type": "eISBN" },
				value: [{ tag: "#text", value: "123-456-789" }],
			},
		]);
	});

	it("should return both idno and imprint when present if there is a subtitle", async () => {
		const jsonDocument = [
			{
				tag: "monogr",
				value: [
					{
						tag: "title",
						attributes: {
							"@type": "main",
							"@level": "m",
						},
						value: [{ tag: "#text", value: "Journal Title" }],
					},
					{
						tag: "title",
						attributes: {
							"@type": "sub",
							"@level": "j",
						},
						value: [{ tag: "#text", value: "Journal Subtitle" }],
					},
					{
						tag: "idno",
						attributes: { "@type": "eISSN" },
						value: [{ tag: "#text", value: "9876-5432" }],
					},
					{
						tag: "imprint",
						value: [
							{
								tag: "publisher",
								value: [{ tag: "#text", value: "Journal Publisher" }],
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentSources(), {
			wrapper: ({ children }) => (
				<TestWrapperWithPartialDocument jsonDocument={jsonDocument}>
					{children}
				</TestWrapperWithPartialDocument>
			),
		});

		expect(result.current).toEqual([
			{
				tag: "title",
				attributes: {
					"@type": "main",
					"@level": "m",
				},
				value: [{ tag: "#text", value: "Journal Title" }],
			},
			{
				tag: "#text",
				value: " : ",
			},
			{
				tag: "title",
				attributes: {
					"@type": "sub",
					"@level": "j",
				},
				value: [{ tag: "#text", value: "Journal Subtitle" }],
			},
			{
				tag: "imprint",
				value: [
					{
						tag: "publisher",
						value: [{ tag: "#text", value: "Journal Publisher" }],
					},
				],
			},
			{
				tag: "idno",
				attributes: { "@type": "eISSN" },
				value: [{ tag: "#text", value: "9876-5432" }],
			},
		]);
	});
});
