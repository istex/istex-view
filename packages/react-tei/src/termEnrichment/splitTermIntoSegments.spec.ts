import { describe, expect, it } from "vitest";
import { splitTermIntoSegments } from "./splitTermIntoSegments";

describe("splitTermIntoSegments", () => {
	it("should return empty array when containedTerms is empty", () => {
		const result = splitTermIntoSegments("Hello World", [], ["group1"]);
		expect(result).toEqual([]);
	});

	it("should return empty array when no contained terms match", () => {
		const containedTerms = [{ term: "foo", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([]);
	});

	it("should split container with single contained term at start", () => {
		const containedTerms = [{ term: "Hello", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{ term: "Hello", groups: ["group1", "group2"] },
			{ term: " World", groups: ["group1"], artificial: true },
		]);
	});

	it("should split container with single contained term at end", () => {
		const containedTerms = [{ term: "World", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{ term: "Hello ", groups: ["group1"], artificial: true },
			{ term: "World", groups: ["group1", "group2"] },
		]);
	});

	it("should split container with single contained term in middle", () => {
		const containedTerms = [{ term: "beautiful", groups: ["group2"] }];
		const result = splitTermIntoSegments(
			"Hello beautiful World",
			containedTerms,
			["group1"],
		);
		expect(result).toEqual([
			{ term: "Hello ", groups: ["group1"], artificial: true },
			{ term: "beautiful", groups: ["group1", "group2"] },
			{ term: " World", groups: ["group1"], artificial: true },
		]);
	});

	it("should split container with multiple non-overlapping contained terms", () => {
		const containedTerms = [
			{ term: "Hello", groups: ["group2"] },
			{ term: "World", groups: ["group3"] },
		];
		const result = splitTermIntoSegments(
			"Hello beautiful World",
			containedTerms,
			["group1"],
		);
		expect(result).toEqual([
			{ term: "Hello", groups: ["group1", "group2"] },
			{ term: " beautiful ", groups: ["group1"], artificial: true },
			{ term: "World", groups: ["group1", "group3"] },
		]);
	});

	it("should split container with two overlapping terms", () => {
		const containedTerms = [
			{ term: "Prince Charles", groups: ["group1"] },
			{ term: "Charles Xavier", groups: ["group2"] },
		];
		const result = splitTermIntoSegments(
			"Prince Charles Xavier",
			containedTerms,
			[],
		);
		expect(result).toEqual([
			{ term: "Prince ", groups: ["group1"], sourceTerm: "Prince Charles" },
			{ term: "Charles", groups: ["group1", "group2"], sourceTerm: null },
			{ term: " Xavier", groups: ["group2"], sourceTerm: "Charles Xavier" },
		]);
	});

	it("should handle term that fully contains another term", () => {
		const containedTerms = [
			{ term: "New York", groups: ["group2"] },
			{ term: "York", groups: ["group3"] },
		];
		const result = splitTermIntoSegments("New York City", containedTerms, [
			"group1",
		]);
		// "York" is contained within "New York", so only "New York" is a direct child
		expect(result).toEqual([
			{
				term: "New York",
				groups: ["group1", "group2"],
				subTerms: [
					{
						term: "New ",
						groups: ["group1", "group2"],
						artificial: true,
						sourceTerm: "New York",
					},
					{ term: "York", groups: ["group1", "group2", "group3"] },
				],
			},
			{ term: " City", groups: ["group1"], artificial: true },
		]);
	});

	it("should handle adjacent terms without gap", () => {
		const containedTerms = [
			{ term: "San Francisco", groups: ["group2"] },
			{ term: "Bay Area", groups: ["group3"] },
		];
		const result = splitTermIntoSegments(
			"San Francisco Bay Area",
			containedTerms,
			["group1"],
		);
		expect(result).toEqual([
			{ term: "San Francisco", groups: ["group1", "group2"] },
			{ term: " ", groups: ["group1"], artificial: true },
			{ term: "Bay Area", groups: ["group1", "group3"] },
		]);
	});

	it("should preserve existing subTerms and propagate groups", () => {
		const containedTerms = [
			{
				term: "New York",
				groups: ["group2"],
				subTerms: [
					{ term: "New", groups: ["group4"] },
					{ term: " ", groups: ["group2"], artificial: true },
					{ term: "York", groups: ["group3"] },
				],
			},
		];
		const result = splitTermIntoSegments("New York City", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{
				term: "New York",
				groups: ["group1", "group2"],
				subTerms: [
					{ term: "New", groups: ["group1", "group2", "group4"] },
					{ term: " ", groups: ["group1", "group2"], artificial: true },
					{ term: "York", groups: ["group1", "group2", "group3"] },
				],
			},
			{ term: " City", groups: ["group1"], artificial: true },
		]);
	});

	it("should handle empty parentGroups", () => {
		const containedTerms = [{ term: "test", groups: ["group1"] }];
		const result = splitTermIntoSegments("a test here", containedTerms, []);
		expect(result).toEqual([
			{ term: "a ", groups: [], artificial: true },
			{ term: "test", groups: ["group1"] },
			{ term: " here", groups: [], artificial: true },
		]);
	});

	it("should handle term at exact container boundaries", () => {
		const containedTerms = [{ term: "Hello World", groups: ["group2"] }];
		const result = splitTermIntoSegments("Hello World", containedTerms, [
			"group1",
		]);
		expect(result).toEqual([
			{ term: "Hello World", groups: ["group1", "group2"] },
		]);
	});
});
