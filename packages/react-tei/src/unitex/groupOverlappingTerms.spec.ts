import { describe, expect, it } from "vitest";
import { groupOverlappingTerms } from "./groupOverlappingTerms";
import type { TermWithPosition } from "./types";

describe("groupOverlappingTerms", () => {
	it("should return an empty array when given an empty array", () => {
		const result = groupOverlappingTerms([]);
		expect(result).toEqual([]);
	});

	it("should return a single group with one term when given a single term", () => {
		const terms: TermWithPosition[] = [
			{ term: { term: "term", groups: ["group1"] }, start: 0, end: 5 },
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { term: "term", groups: ["group1"] },
					start: 0,
					end: 5,
				},
			],
		]);
	});

	it("should return separate groups for non-overlapping terms", () => {
		const terms: TermWithPosition[] = [
			{ term: { term: "hello", groups: ["group1"] }, start: 0, end: 5 },
			{ term: { term: "world", groups: ["group1"] }, start: 10, end: 15 },
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { term: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
			],
			[
				{
					term: { term: "world", groups: ["group1"] },
					start: 10,
					end: 15,
				},
			],
		]);
	});

	it("should group overlapping terms together", () => {
		const terms: TermWithPosition[] = [
			{ term: { term: "hello world", groups: ["group1"] }, start: 0, end: 11 },
			{ term: { term: "world", groups: ["group2"] }, start: 6, end: 11 },
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { term: "hello world", groups: ["group1"] },
					start: 0,
					end: 11,
				},
				{ term: { term: "world", groups: ["group2"] }, start: 6, end: 11 },
			],
		]);
	});

	it("should group multiple overlapping terms in the same group", () => {
		const terms: TermWithPosition[] = [
			{
				term: { term: "United States of America", groups: ["group1"] },
				start: 0,
				end: 24,
			},
			{
				term: { term: "States of America", groups: ["group2"] },
				start: 7,
				end: 24,
			},
			{ term: { term: "America", groups: ["group3"] }, start: 17, end: 24 },
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { term: "United States of America", groups: ["group1"] },
					start: 0,
					end: 24,
				},
				{
					term: { term: "States of America", groups: ["group2"] },
					start: 7,
					end: 24,
				},
				{
					term: { term: "America", groups: ["group3"] },
					start: 17,
					end: 24,
				},
			],
		]);
	});

	it("should handle adjacent but non-overlapping terms as separate groups", () => {
		const terms: TermWithPosition[] = [
			{ term: { term: "hello", groups: ["group1"] }, start: 0, end: 5 },
			{ term: { term: "world", groups: ["group1"] }, start: 5, end: 10 },
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { term: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
			],
			[
				{
					term: { term: "world", groups: ["group1"] },
					start: 5,
					end: 10,
				},
			],
		]);
	});

	it("should handle a mix of overlapping and non-overlapping terms", () => {
		const terms: TermWithPosition[] = [
			{ term: { term: "New York", groups: ["group1"] }, start: 0, end: 8 },
			{ term: { term: "York", groups: ["group2"] }, start: 4, end: 8 },
			{ term: { term: "City", groups: ["group1"] }, start: 20, end: 24 },
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{ term: { term: "New York", groups: ["group1"] }, start: 0, end: 8 },
				{ term: { term: "York", groups: ["group2"] }, start: 4, end: 8 },
			],
			[{ term: { term: "City", groups: ["group1"] }, start: 20, end: 24 }],
		]);
	});

	it("should handle terms that partially overlap", () => {
		const terms: TermWithPosition[] = [
			{
				term: { term: "Prince Charles", groups: ["group1"] },
				start: 0,
				end: 14,
			},
			{
				term: { term: "Charles Xavier", groups: ["group1"] },
				start: 7,
				end: 21,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { term: "Prince Charles", groups: ["group1"] },
					start: 0,
					end: 14,
				},
				{
					term: { term: "Charles Xavier", groups: ["group1"] },
					start: 7,
					end: 21,
				},
			],
		]);
	});

	it("should handle a chain of overlapping terms extending the group", () => {
		const terms: TermWithPosition[] = [
			{ term: { term: "A", groups: ["g1"] }, start: 0, end: 5 },
			{ term: { term: "B", groups: ["g2"] }, start: 3, end: 8 },
			{ term: { term: "C", groups: ["g3"] }, start: 6, end: 11 },
		];
		const result = groupOverlappingTerms(terms);
		// B overlaps with A, C overlaps with B, so all should be in one group
		expect(result).toEqual([
			[
				{ term: { term: "A", groups: ["g1"] }, start: 0, end: 5 },
				{ term: { term: "B", groups: ["g2"] }, start: 3, end: 8 },
				{ term: { term: "C", groups: ["g3"] }, start: 6, end: 11 },
			],
		]);
	});

	it("should handle multiple separate groups of overlapping terms", () => {
		const terms: TermWithPosition[] = [
			{ term: { term: "cat", groups: ["g1"] }, start: 0, end: 3 },
			{ term: { term: "cat lover", groups: ["g2"] }, start: 0, end: 9 },
			{ term: { term: "dog", groups: ["g1"] }, start: 20, end: 23 },
			{ term: { term: "dog owner", groups: ["g2"] }, start: 20, end: 29 },
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{ term: { term: "cat", groups: ["g1"] }, start: 0, end: 3 },
				{ term: { term: "cat lover", groups: ["g2"] }, start: 0, end: 9 },
			],
			[
				{ term: { term: "dog", groups: ["g1"] }, start: 20, end: 23 },
				{ term: { term: "dog owner", groups: ["g2"] }, start: 20, end: 29 },
			],
		]);
	});
});
