import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { hasInnerText, useFigureValue } from "./useFigureValue";

describe("hasInnerText", () => {
	it.each<{ document: DocumentJson; label: string }>([
		{ document: { tag: "figDesc", value: "" }, label: "empty string" },
		{
			document: { tag: "figDesc", value: "   " },
			label: "string with only spaces",
		},
		{ document: { tag: "figDesc", value: [] }, label: "empty array" },
		{
			document: { tag: "figDesc", value: [{ tag: "p", value: [] }] },
			label: "array with child having empty array",
		},
	])("should return false when $label", ({ document }) => {
		expect(hasInnerText(document)).toBe(false);
	});

	it("should return true when document has non-empty string value", () => {
		const document: DocumentJson = {
			tag: "figDesc",
			value: [
				{
					tag: "div",
					value: [
						{
							tag: "p",
							value: [{ tag: "#text", value: "Some text" }],
						},
					],
				},
			],
		};
		expect(hasInnerText(document)).toBe(true);
	});
});

describe("useFigureValue", () => {
	it("should return the original value if it is not an array", async () => {
		const result = await renderHook(() =>
			useFigureValue({ data: { tag: "figure", value: "not an array" } }),
		);
		expect(result.result.current).toBe("not an array");
	});

	it("should return the filtered array value if it is an array", async () => {
		const inputValue: DocumentJson["value"] = [
			{ tag: "graphic", value: "should be filtered out" },
			{ tag: "link", value: "should be filtered out" },
			{ tag: "figDesc", value: [{ tag: "#text", value: "has inner text" }] },
			{ tag: "table", value: [] },
		];

		const expectedOutput = [
			{ tag: "figDesc", value: [{ tag: "#text", value: "has inner text" }] },
		];

		const result = await renderHook(() =>
			useFigureValue({ data: { tag: "figure", value: inputValue } }),
		);
		expect(result.result.current).toEqual(expectedOutput);
	});
});
