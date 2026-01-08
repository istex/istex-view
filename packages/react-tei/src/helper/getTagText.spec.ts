import { describe, expect, it } from "vitest";
import { getTagText } from "./getTagText";

describe("getTagText", () => {
	it("should extract text from a tag", () => {
		const result = getTagText({
			tag: "example",
			value: [
				{
					tag: "#text",
					value: "Sample text",
				},
			],
		});

		expect(result).toBe("Sample text");
	});

	it("should return the first non-empty text", () => {
		const result = getTagText({
			tag: "example",
			value: [
				{
					tag: "#text",
					value: "   ",
				},
				{
					tag: "#text",
					value: "First valid text",
				},
				{
					tag: "#text",
					value: "Second valid text",
				},
			],
		});

		expect(result).toBe("First valid text");
	});

	it("should return undefined if no text found", () => {
		const result = getTagText({
			tag: "example",
			value: [
				{
					tag: "#text",
					value: "   ",
				},
				{
					tag: "#text",
					value: "",
				},
			],
		});

		expect(result).toBeUndefined();
	});
});
