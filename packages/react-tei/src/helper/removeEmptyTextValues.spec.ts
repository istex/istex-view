import { describe, expect, it } from "vitest";
import { removeEmptyTextValues } from "./removeEmptyTextValues";

describe("removeEmptyTextValues", () => {
	it("should remove documents with empty text values", () => {
		const documents = [
			{ tag: "#text", value: "Hello World" },
			{ tag: "#text", value: "\n   " },
			{ tag: "p", value: "This is a paragraph." },
			{ tag: "#text", value: "" },
		];

		const result = removeEmptyTextValues(documents);

		expect(result).toEqual([
			{ tag: "#text", value: "Hello World" },
			{ tag: "p", value: "This is a paragraph." },
		]);
	});

	it("should remove documents recursively", () => {
		const documents = [
			{ tag: "#text", value: "   " },
			{
				tag: "p",
				value: [
					{ tag: "#text", value: "" },
					{ tag: "#text", value: "Valid text" },
				],
			},
			{
				tag: "div",
				value: [
					{ tag: "#text", value: "   " },
					{
						tag: "p",
						value: [
							{ tag: "#text", value: "" },
							{ tag: "#text", value: 4.5 },
						],
					},
				],
			},
		];

		const result = removeEmptyTextValues(documents);

		expect(result).toEqual([
			{ tag: "p", value: [{ tag: "#text", value: "Valid text" }] },
			{
				tag: "div",
				value: [{ tag: "p", value: [{ tag: "#text", value: 4.5 }] }],
			},
		]);
	});
});
