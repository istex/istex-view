import { describe, expect, it } from "vitest";
import { countTags } from "./countTags";

describe("countTags", () => {
	it("should count tags correctly in a simple document", () => {
		const doc = {
			tag: "div",
			value: [
				{ tag: "p", value: [] },
				{ tag: "p", value: [] },
				{ tag: "span", value: [] },
			],
		};
		expect(countTags(doc, "p")).toBe(2);
		expect(countTags(doc, "span")).toBe(1);
		expect(countTags(doc, "div")).toBe(1);
	});

	it("should return 0 if no tags match", () => {
		const doc = { tag: "div", value: [] };
		expect(countTags(doc, "p")).toBe(0);
	});

	it("should handle nested structures", () => {
		const doc = {
			tag: "div",
			value: [
				{
					tag: "section",
					value: [
						{ tag: "p", value: [] },
						{ tag: "p", value: [] },
					],
				},
				{ tag: "p", value: [] },
			],
		};
		expect(countTags(doc, "p")).toBe(3);
		expect(countTags(doc, "section")).toBe(1);
	});

	it("should handle documents with no children", () => {
		const doc = { tag: "p", value: [] };
		expect(countTags(doc, "p")).toBe(1);
		expect(countTags(doc, "div")).toBe(0);
	});
});
