import { describe, expect, it } from "vitest";
import { splitTermIntoSegments } from "./splitTermIntoSegments";

describe("splitTermIntoSegments", () => {
	it("should return empty array when containedTerms is empty", () => {
		const result = splitTermIntoSegments("Hello World", [], ["group1"]);
		expect(result).toEqual([]);
	});

	it("should return empty array when no contained terms match", () => {
		const containedTerms = [{ targetText: "foo", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([]);
	});

	it("should split container with single contained term at start", () => {
		const containedTerms = [{ targetText: "Hello", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{ targetText: "Hello", groups: ["group1", "group2"] },
			{ targetText: " World", groups: ["group1"], artificial: true },
		]);
	});

	it("should split container with single contained term at end", () => {
		const containedTerms = [{ targetText: "World", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{ targetText: "Hello ", groups: ["group1"], artificial: true },
			{ targetText: "World", groups: ["group1", "group2"] },
		]);
	});

	it("should split container with single contained term in middle", () => {
		const containedTerms = [{ targetText: "beautiful", groups: ["group2"] }];
		const result = splitTermIntoSegments(
			"Hello beautiful World",
			containedTerms,
			["group1"],
		);
		expect(result).toEqual([
			{ targetText: "Hello ", groups: ["group1"], artificial: true },
			{ targetText: "beautiful", groups: ["group1", "group2"] },
			{ targetText: " World", groups: ["group1"], artificial: true },
		]);
	});

	it("should split container with multiple non-overlapping contained terms", () => {
		const containedTerms = [
			{ targetText: "Hello", groups: ["group2"] },
			{ targetText: "World", groups: ["group3"] },
		];
		const result = splitTermIntoSegments(
			"Hello beautiful World",
			containedTerms,
			["group1"],
		);
		expect(result).toEqual([
			{ targetText: "Hello", groups: ["group1", "group2"] },
			{ targetText: " beautiful ", groups: ["group1"], artificial: true },
			{ targetText: "World", groups: ["group1", "group3"] },
		]);
	});

	it("should split container with two overlapping terms", () => {
		const containedTerms = [
			{ targetText: "Prince Charles", groups: ["group1"] },
			{ targetText: "Charles Xavier", groups: ["group2"] },
		];
		const result = splitTermIntoSegments(
			"Prince Charles Xavier",
			containedTerms,
			[],
		);
		expect(result).toEqual([
			{
				targetText: "Prince ",
				groups: ["group1"],
				sourceTerm: "Prince Charles",
			},
			{ targetText: "Charles", groups: ["group1", "group2"], sourceTerm: null },
			{
				targetText: " Xavier",
				groups: ["group2"],
				sourceTerm: "Charles Xavier",
			},
		]);
	});

	it("should handle term that fully contains another term", () => {
		const containedTerms = [
			{ targetText: "New York", groups: ["group2"] },
			{ targetText: "York", groups: ["group3"] },
		];
		const result = splitTermIntoSegments("New York City", containedTerms, [
			"group1",
		]);
		// "York" is contained within "New York", so only "New York" is a direct child
		expect(result).toEqual([
			{
				targetText: "New York",
				groups: ["group1", "group2"],
				subTerms: [
					{
						targetText: "New ",
						groups: ["group1", "group2"],
						artificial: true,
						sourceTerm: "New York",
					},
					{ targetText: "York", groups: ["group1", "group2", "group3"] },
				],
			},
			{ targetText: " City", groups: ["group1"], artificial: true },
		]);
	});

	it("should handle adjacent terms without gap", () => {
		const containedTerms = [
			{ targetText: "San Francisco", groups: ["group2"] },
			{ targetText: "Bay Area", groups: ["group3"] },
		];
		const result = splitTermIntoSegments(
			"San Francisco Bay Area",
			containedTerms,
			["group1"],
		);
		expect(result).toEqual([
			{ targetText: "San Francisco", groups: ["group1", "group2"] },
			{ targetText: " ", groups: ["group1"], artificial: true },
			{ targetText: "Bay Area", groups: ["group1", "group3"] },
		]);
	});

	it("should preserve existing subTerms and propagate groups", () => {
		const containedTerms = [
			{
				targetText: "New York",
				groups: ["group2"],
				subTerms: [
					{ targetText: "New", groups: ["group4"] },
					{ targetText: " ", groups: ["group2"], artificial: true },
					{ targetText: "York", groups: ["group3"] },
				],
			},
		];
		const result = splitTermIntoSegments("New York City", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{
				targetText: "New York",
				groups: ["group1", "group2"],
				subTerms: [
					{ targetText: "New", groups: ["group1", "group2", "group4"] },
					{ targetText: " ", groups: ["group1", "group2"], artificial: true },
					{ targetText: "York", groups: ["group1", "group2", "group3"] },
				],
			},
			{ targetText: " City", groups: ["group1"], artificial: true },
		]);
	});

	it("should handle empty parentGroups", () => {
		const containedTerms = [{ targetText: "test", groups: ["group1"] }];
		const result = splitTermIntoSegments("a test here", containedTerms, []);
		expect(result).toEqual([
			{ targetText: "a ", groups: [], artificial: true },
			{ targetText: "test", groups: ["group1"] },
			{ targetText: " here", groups: [], artificial: true },
		]);
	});

	it("should handle term at exact container boundaries", () => {
		const containedTerms = [{ targetText: "Hello World", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{ targetText: "Hello World", groups: ["group1", "group2"] },
		]);
	});
});
