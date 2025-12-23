import { describe, expect, it } from "vitest";
import { findChildrenByName } from "./findChildrenByName";

describe("findChildrenByName", () => {
	it("should return an empty array when document is undefined", () => {
		const children = findChildrenByName(undefined, "anyTag");
		expect(children).toEqual([]);
	});

	it("should return an empty array when document value is not an array", () => {
		const document = {
			tag: "parent",
			attributes: {},
			value: "notAnArray",
		};
		const children = findChildrenByName(document, "anyTag");
		expect(children).toEqual([]);
	});

	it("should return an empty array when no children match the tag name", () => {
		const document = {
			tag: "parent",
			attributes: {},
			value: [
				{ tag: "child1", attributes: {}, value: [] },
				{ tag: "child2", attributes: {}, value: [] },
			],
		};
		const children = findChildrenByName(document, "nonExistentTag");
		expect(children).toEqual([]);
	});

	it("should return all children matching the tag name", () => {
		const document = {
			tag: "parent",
			attributes: {},
			value: [
				{ tag: "child", attributes: {}, value: [] },
				{ tag: "child", attributes: {}, value: [] },
				{ tag: "otherChild", attributes: {}, value: [] },
			],
		};
		const children = findChildrenByName(document, "child");
		expect(children).toEqual([
			{ tag: "child", attributes: {}, value: [] },
			{ tag: "child", attributes: {}, value: [] },
		]);
	});
});
