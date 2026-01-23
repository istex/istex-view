import { describe, expect, it } from "vitest";
import {
	buildSubTermsPositionMap,
	collectBoundaries,
	splitOverlappingTermsIntoSegments,
} from "./splitOverlappingTermsIntoSegments";
import type { TermWithPosition } from "./types";

describe("splitOverlappingTermsIntoSegments", () => {
	describe("collectBoundaries", () => {
		it("should return empty array for empty overlapping group", () => {
			const result = collectBoundaries([]);
			expect(result).toEqual([]);
		});

		it("should collect start and end boundaries from terms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { targetText: "world", groups: ["group2"] },
					start: 3,
					end: 8,
				},
			];

			const result = collectBoundaries(overlappingGroup);

			expect(result).toEqual([0, 3, 5, 8]);
		});

		it("should collect boundaries from subTerms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						subTerms: [
							{ targetText: "hello", groups: ["group2"] },
							{ targetText: " ", groups: [], artificial: true },
							{ targetText: "world", groups: ["group3"] },
						],
					},
					start: 0,
					end: 11,
				},
			];

			const result = collectBoundaries(overlappingGroup);

			expect(result).toEqual([0, 5, 6, 11]);
		});

		it("should deduplicate boundaries", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { targetText: "hello", groups: ["group2"] },
					start: 0,
					end: 5,
				},
			];

			const result = collectBoundaries(overlappingGroup);

			expect(result).toEqual([0, 5]);
		});

		it("should sort boundaries in ascending order", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "world", groups: ["group2"] },
					start: 6,
					end: 11,
				},
				{
					term: { targetText: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
			];

			const result = collectBoundaries(overlappingGroup);

			expect(result).toEqual([0, 5, 6, 11]);
		});
	});

	describe("buildSubTermsPositionMap", () => {
		it("should return empty array for terms without subTerms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
			];

			const result = buildSubTermsPositionMap(overlappingGroup);

			expect(result).toEqual([]);
		});

		it("should build position map for subTerms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						subTerms: [
							{ targetText: "hello", groups: ["group2"] },
							{ targetText: " ", groups: [], artificial: true },
							{ targetText: "world", groups: ["group3"] },
						],
					},
					start: 0,
					end: 11,
				},
			];

			const result = buildSubTermsPositionMap(overlappingGroup);

			expect(result).toEqual([
				{
					subTerm: { targetText: "hello", groups: ["group2"] },
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { targetText: " ", groups: [], artificial: true },
					start: 5,
					end: 6,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { targetText: "world", groups: ["group3"] },
					start: 6,
					end: 11,
					fromTermGroups: ["group1"],
				},
			]);
		});

		it("should handle multiple terms with subTerms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						subTerms: [
							{ targetText: "hello", groups: ["group2"] },
							{ targetText: " world", groups: [], artificial: true },
						],
					},
					start: 0,
					end: 11,
				},
				{
					term: {
						targetText: "world peace",
						groups: ["group3"],
						subTerms: [
							{ targetText: "world", groups: ["group4"] },
							{ targetText: " peace", groups: [], artificial: true },
						],
					},
					start: 6,
					end: 17,
				},
			];

			const result = buildSubTermsPositionMap(overlappingGroup);

			expect(result).toEqual([
				{
					subTerm: { targetText: "hello", groups: ["group2"] },
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { targetText: " world", groups: [], artificial: true },
					start: 5,
					end: 11,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { targetText: "world", groups: ["group4"] },
					start: 6,
					end: 11,
					fromTermGroups: ["group3"],
				},
				{
					subTerm: { targetText: " peace", groups: [], artificial: true },
					start: 11,
					end: 17,
					fromTermGroups: ["group3"],
				},
			]);
		});
	});

	describe("splitOverlappingTermsIntoSegments", () => {
		it("should return empty array for empty overlapping group", () => {
			const result = splitOverlappingTermsIntoSegments([], [], "container", []);

			expect(result).toEqual([]);
		});

		it("should split two overlapping terms into segments", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "Prince Charles", groups: ["group1"] },
					start: 0,
					end: 14,
				},
				{
					term: { targetText: "Charles Xavier", groups: ["group2"] },
					start: 7,
					end: 21,
				},
			];
			const containerTerm = "Prince Charles Xavier";

			const result = splitOverlappingTermsIntoSegments(
				overlappingGroup,
				overlappingGroup,
				containerTerm,
				[],
			);

			expect(result).toEqual([
				{
					targetText: "Prince ",
					groups: ["group1"],
					sourceTerm: "Prince Charles",
				},
				{
					targetText: "Charles",
					groups: ["group1", "group2"],
					sourceTerm: null,
				},
				{
					targetText: " Xavier",
					groups: ["group2"],
					sourceTerm: "Charles Xavier",
				},
			]);
		});

		it("should include parent groups in segments", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "hello world", groups: ["group1"] },
					start: 0,
					end: 11,
				},
				{
					term: { targetText: "world peace", groups: ["group2"] },
					start: 6,
					end: 17,
				},
			];
			const containerTerm = "hello world peace";
			const parentGroups = ["parentGroup"];

			const result = splitOverlappingTermsIntoSegments(
				overlappingGroup,
				overlappingGroup,
				containerTerm,
				parentGroups,
			);

			expect(result).toEqual([
				{
					targetText: "hello ",
					groups: ["group1", "parentGroup"],
					sourceTerm: "hello world",
				},
				{
					targetText: "world",
					groups: ["group1", "group2", "parentGroup"],
					sourceTerm: null,
				},
				{
					targetText: " peace",
					groups: ["group2", "parentGroup"],
					sourceTerm: "world peace",
				},
			]);
		});

		it("should handle terms with subTerms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "New York",
						groups: ["group1"],
						subTerms: [
							{ targetText: "New ", groups: [], artificial: true },
							{ targetText: "York", groups: ["group2"] },
						],
					},
					start: 0,
					end: 8,
				},
				{
					term: { targetText: "York City", groups: ["group3"] },
					start: 4,
					end: 13,
				},
			];
			const containerTerm = "New York City";

			const result = splitOverlappingTermsIntoSegments(
				overlappingGroup,
				overlappingGroup,
				containerTerm,
				[],
			);

			// Note: group2 from the subTerm is not included because groups are computed
			// from covering terms (group1, group3), not from subTerm definitions
			expect(result).toEqual([
				{
					targetText: "New ",
					groups: ["group1"],
					sourceTerm: "New York",
					artificial: true,
				},
				{
					targetText: "York",
					groups: ["group1", "group3"],
					sourceTerm: null,
				},
				{ targetText: " City", groups: ["group3"], sourceTerm: "York City" },
			]);
		});

		it("should use allTerms for group computation", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "hello world", groups: ["group1"] },
					start: 0,
					end: 11,
				},
			];
			const allTerms: TermWithPosition[] = [
				...overlappingGroup,
				{
					term: { targetText: "hello world!", groups: ["group2"] },
					start: 0,
					end: 11,
				},
			];
			const containerTerm = "hello world";

			const result = splitOverlappingTermsIntoSegments(
				overlappingGroup,
				allTerms,
				containerTerm,
				[],
			);

			expect(result).toEqual([
				{
					targetText: "hello world",
					groups: ["group1", "group2"],
					sourceTerm: "hello world",
				},
			]);
		});

		it("should handle three overlapping terms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "A B C", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { targetText: "B C D", groups: ["group2"] },
					start: 2,
					end: 7,
				},
				{
					term: { targetText: "C D E", groups: ["group3"] },
					start: 4,
					end: 9,
				},
			];
			const containerTerm = "A B C D E";

			const result = splitOverlappingTermsIntoSegments(
				overlappingGroup,
				overlappingGroup,
				containerTerm,
				[],
			);

			expect(result).toEqual([
				{ targetText: "A ", groups: ["group1"], sourceTerm: "A B C" },
				{ targetText: "B ", groups: ["group1", "group2"], sourceTerm: null },
				{
					targetText: "C",
					groups: ["group1", "group2", "group3"],
					sourceTerm: null,
				},
				{ targetText: " D", groups: ["group2", "group3"], sourceTerm: null },
				{ targetText: " E", groups: ["group3"], sourceTerm: "C D E" },
			]);
		});

		it("should handle completely overlapping terms with same boundaries", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { targetText: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { targetText: "hello", groups: ["group2"] },
					start: 0,
					end: 5,
				},
			];
			const containerTerm = "hello";

			const result = splitOverlappingTermsIntoSegments(
				overlappingGroup,
				overlappingGroup,
				containerTerm,
				[],
			);

			expect(result).toEqual([
				{
					targetText: "hello",
					groups: ["group1", "group2"],
					sourceTerm: "hello",
				},
			]);
		});
	});
});
