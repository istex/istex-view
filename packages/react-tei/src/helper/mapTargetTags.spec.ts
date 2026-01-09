import { describe, expect, it } from "vitest";
import { mapTargetTags } from "./mapTargetTags";

describe("mapTargetTags", () => {
	it("should call given function on all target tags", () => {
		const document = {
			tag: "div",
			value: [
				{ tag: "span", value: "Hello" },
				{ tag: "p", value: "World" },
				{ tag: "span", value: "!" },
			],
		};

		const replaceTag = (tag: any) => ({
			...tag,
			tag: "strong",
		});

		const result = mapTargetTags(document, "span", replaceTag);

		expect(result).toEqual({
			tag: "div",
			value: [
				{ tag: "strong", value: "Hello" },
				{ tag: "p", value: "World" },
				{ tag: "strong", value: "!" },
			],
		});
	});
	it("should not modify document if no target tags are found", () => {
		const document = {
			tag: "div",
			value: [
				{ tag: "p", value: "Hello" },
				{ tag: "p", value: "World" },
			],
		};

		const replaceTag = (tag: any) => ({
			...tag,
			tag: "strong",
		});

		const result = mapTargetTags(document, "span", replaceTag);

		expect(result).toEqual(document);
	});

	it("should handle documents with no children", () => {
		const document = {
			tag: "span",
			value: "Hello World",
		};
		const replaceTag = (tag: any) => ({
			...tag,
			tag: "strong",
		});
		const result = mapTargetTags(document, "span", replaceTag);
		expect(result).toEqual({
			tag: "strong",
			value: "Hello World",
		});
	});

	it("should not handle nested target tags", () => {
		const document = {
			tag: "div",
			value: [
				{
					tag: "span",
					value: [{ tag: "span", value: "Nested" }],
				},
				{ tag: "p", value: "Text" },
			],
		};

		const replaceTag = (tag: any) => ({
			...tag,
			tag: "strong",
		});

		const result = mapTargetTags(document, "span", replaceTag);

		expect(result).toEqual({
			tag: "div",
			value: [
				{
					tag: "strong",
					value: [{ tag: "span", value: "Nested" }],
				},
				{ tag: "p", value: "Text" },
			],
		});
	});

	it("should replace root tag if it matches target tag", () => {
		const document = {
			tag: "span",
			value: [
				{ tag: "p", value: "Root Tag" },
				{ tag: "div", value: "Should not change" },
			],
		};
		const replaceTag = (tag: any) => ({
			...tag,
			tag: "strong",
		});
		const result = mapTargetTags(document, "span", replaceTag);
		expect(result).toEqual({
			tag: "strong",
			value: [
				{ tag: "p", value: "Root Tag" },
				{ tag: "div", value: "Should not change" },
			],
		});
	});
});
