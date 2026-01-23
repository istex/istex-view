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
			{
				term: { targetText: "term", groups: ["group1"], sourceTerm: [] },
				start: 0,
				end: 5,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { targetText: "term", groups: ["group1"], sourceTerm: [] },
					start: 0,
					end: 5,
				},
			],
		]);
	});

	it("should return separate groups for non-overlapping terms", () => {
		const terms: TermWithPosition[] = [
			{
				term: { targetText: "hello", groups: ["group1"], sourceTerm: [] },
				start: 0,
				end: 5,
			},
			{
				term: { targetText: "world", groups: ["group1"], sourceTerm: [] },
				start: 10,
				end: 15,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { targetText: "hello", groups: ["group1"], sourceTerm: [] },
					start: 0,
					end: 5,
				},
			],
			[
				{
					term: { targetText: "world", groups: ["group1"], sourceTerm: [] },
					start: 10,
					end: 15,
				},
			],
		]);
	});

	it("should group overlapping terms together", () => {
		const terms: TermWithPosition[] = [
			{
				term: { targetText: "hello world", groups: ["group1"], sourceTerm: [] },
				start: 0,
				end: 11,
			},
			{
				term: { targetText: "world", groups: ["group2"], sourceTerm: [] },
				start: 6,
				end: 11,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
				{
					term: { targetText: "world", groups: ["group2"], sourceTerm: [] },
					start: 6,
					end: 11,
				},
			],
		]);
	});

	it("should group multiple overlapping terms in the same group", () => {
		const terms: TermWithPosition[] = [
			{
				term: {
					targetText: "United States of America",
					groups: ["group1"],
					sourceTerm: [],
				},
				start: 0,
				end: 24,
			},
			{
				term: {
					targetText: "States of America",
					groups: ["group2"],
					sourceTerm: [],
				},
				start: 7,
				end: 24,
			},
			{
				term: { targetText: "America", groups: ["group3"], sourceTerm: [] },
				start: 17,
				end: 24,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: {
						targetText: "United States of America",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 24,
				},
				{
					term: {
						targetText: "States of America",
						groups: ["group2"],
						sourceTerm: [],
					},
					start: 7,
					end: 24,
				},
				{
					term: { targetText: "America", groups: ["group3"], sourceTerm: [] },
					start: 17,
					end: 24,
				},
			],
		]);
	});

	it("should handle adjacent but non-overlapping terms as separate groups", () => {
		const terms: TermWithPosition[] = [
			{
				term: { targetText: "hello", groups: ["group1"], sourceTerm: [] },
				start: 0,
				end: 5,
			},
			{
				term: { targetText: "world", groups: ["group1"], sourceTerm: [] },
				start: 5,
				end: 10,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { targetText: "hello", groups: ["group1"], sourceTerm: [] },
					start: 0,
					end: 5,
				},
			],
			[
				{
					term: { targetText: "world", groups: ["group1"], sourceTerm: [] },
					start: 5,
					end: 10,
				},
			],
		]);
	});

	it("should handle a mix of overlapping and non-overlapping terms", () => {
		const terms: TermWithPosition[] = [
			{
				term: { targetText: "New York", groups: ["group1"], sourceTerm: [] },
				start: 0,
				end: 8,
			},
			{
				term: { targetText: "York", groups: ["group2"], sourceTerm: [] },
				start: 4,
				end: 8,
			},
			{
				term: { targetText: "City", groups: ["group1"], sourceTerm: [] },
				start: 20,
				end: 24,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { targetText: "New York", groups: ["group1"] },
					start: 0,
					end: 8,
				},
				{ term: { targetText: "York", groups: ["group2"] }, start: 4, end: 8 },
			],
			[
				{
					term: { targetText: "City", groups: ["group1"] },
					start: 20,
					end: 24,
				},
			],
		]);
	});

	it("should handle terms that partially overlap", () => {
		const terms: TermWithPosition[] = [
			{
				term: {
					targetText: "Prince Charles",
					groups: ["group1"],
					sourceTerm: [],
				},
				start: 0,
				end: 14,
			},
			{
				term: {
					targetText: "Charles Xavier",
					groups: ["group1"],
					sourceTerm: [],
				},
				start: 7,
				end: 21,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{
					term: { targetText: "Prince Charles", groups: ["group1"] },
					start: 0,
					end: 14,
				},
				{
					term: { targetText: "Charles Xavier", groups: ["group1"] },
					start: 7,
					end: 21,
				},
			],
		]);
	});

	it("should handle a chain of overlapping terms extending the group", () => {
		const terms: TermWithPosition[] = [
			{
				term: { targetText: "A", groups: ["g1"], sourceTerm: [] },
				start: 0,
				end: 5,
			},
			{
				term: { targetText: "B", groups: ["g2"], sourceTerm: [] },
				start: 3,
				end: 8,
			},
			{
				term: { targetText: "C", groups: ["g3"], sourceTerm: [] },
				start: 6,
				end: 11,
			},
		];
		const result = groupOverlappingTerms(terms);
		// B overlaps with A, C overlaps with B, so all should be in one group
		expect(result).toEqual([
			[
				{
					term: { targetText: "A", groups: ["g1"], sourceTerm: [] },
					start: 0,
					end: 5,
				},
				{
					term: { targetText: "B", groups: ["g2"], sourceTerm: [] },
					start: 3,
					end: 8,
				},
				{
					term: { targetText: "C", groups: ["g3"], sourceTerm: [] },
					start: 6,
					end: 11,
				},
			],
		]);
	});

	it("should handle multiple separate groups of overlapping terms", () => {
		const terms: TermWithPosition[] = [
			{
				term: { targetText: "cat", groups: ["g1"], sourceTerm: [] },
				start: 0,
				end: 3,
			},
			{
				term: { targetText: "cat lover", groups: ["g2"], sourceTerm: [] },
				start: 0,
				end: 9,
			},
			{
				term: { targetText: "dog", groups: ["g1"], sourceTerm: [] },
				start: 20,
				end: 23,
			},
			{
				term: { targetText: "dog owner", groups: ["g2"], sourceTerm: [] },
				start: 20,
				end: 29,
			},
		];
		const result = groupOverlappingTerms(terms);
		expect(result).toEqual([
			[
				{ term: { targetText: "cat", groups: ["g1"] }, start: 0, end: 3 },
				{ term: { targetText: "cat lover", groups: ["g2"] }, start: 0, end: 9 },
			],
			[
				{ term: { targetText: "dog", groups: ["g1"] }, start: 20, end: 23 },
				{
					term: { targetText: "dog owner", groups: ["g2"] },
					start: 20,
					end: 29,
				},
			],
		]);
	});
});
