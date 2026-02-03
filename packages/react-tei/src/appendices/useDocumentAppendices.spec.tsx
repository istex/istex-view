import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import type { DocumentJson } from "../parser/document";
import { useDocumentAppendices } from "./useDocumentAppendices";

describe("useDocumentAppendices", () => {
	const createWrapper =
		(jsonDocument: DocumentJson[]) =>
		({ children }: { children: React.ReactNode }) => (
			<DocumentContextProvider jsonDocument={jsonDocument}>
				{children}
			</DocumentContextProvider>
		);

	it("should return null when jsonDocument is empty", async () => {
		const { result } = await renderHook(() => useDocumentAppendices(), {
			wrapper: createWrapper([]),
		});

		expect(result.current).toBeNull();
	});

	it("should return null when back element is missing", async () => {
		const jsonDocument: DocumentJson[] = [
			{
				tag: "TEI",
				value: [
					{
						tag: "text",
						value: [
							{
								tag: "body",
								value: [],
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentAppendices(), {
			wrapper: createWrapper(jsonDocument),
		});

		expect(result.current).toBeNull();
	});

	it("should return null when back element has no value", async () => {
		const jsonDocument: DocumentJson[] = [
			{
				tag: "TEI",
				value: [
					{
						tag: "text",
						value: [
							{
								tag: "back",
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentAppendices(), {
			wrapper: createWrapper(jsonDocument),
		});

		expect(result.current).toBeNull();
	});

	it("should return null when back element value is not an array", async () => {
		const jsonDocument: DocumentJson[] = [
			{
				tag: "TEI",
				value: [
					{
						tag: "text",
						value: [
							{
								tag: "back",
								value: "some string value",
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentAppendices(), {
			wrapper: createWrapper(jsonDocument),
		});

		expect(result.current).toBeNull();
	});

	it("should return null when no appendices div is found in back", async () => {
		const jsonDocument: DocumentJson[] = [
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
										attributes: { "@type": "bibliography" },
										value: [],
									},
								],
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentAppendices(), {
			wrapper: createWrapper(jsonDocument),
		});

		expect(result.current).toBeNull();
	});

	it("should return the appendices div when found", async () => {
		const appendicesDiv: DocumentJson = {
			tag: "div",
			attributes: { "@type": "appendices" },
			value: [
				{
					tag: "div",
					attributes: { "@type": "appendix" },
					value: [
						{
							tag: "head",
							value: "Appendix A",
						},
					],
				},
			],
		};

		const jsonDocument: DocumentJson[] = [
			{
				tag: "TEI",
				value: [
					{
						tag: "text",
						value: [
							{
								tag: "back",
								value: [appendicesDiv],
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentAppendices(), {
			wrapper: createWrapper(jsonDocument),
		});

		expect(result.current).toStrictEqual(appendicesDiv);
	});

	it("should find appendices div among multiple sections in back", async () => {
		const appendicesDiv: DocumentJson = {
			tag: "div",
			attributes: { "@type": "appendices" },
			value: [
				{
					tag: "p",
					value: "Appendix content",
				},
			],
		};

		const jsonDocument: DocumentJson[] = [
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
										attributes: { "@type": "bibliography" },
										value: [],
									},
									appendicesDiv,
									{
										tag: "div",
										attributes: { "@type": "notes" },
										value: [],
									},
								],
							},
						],
					},
				],
			},
		];

		const { result } = await renderHook(() => useDocumentAppendices(), {
			wrapper: createWrapper(jsonDocument),
		});

		expect(result.current).toStrictEqual(appendicesDiv);
	});
});
