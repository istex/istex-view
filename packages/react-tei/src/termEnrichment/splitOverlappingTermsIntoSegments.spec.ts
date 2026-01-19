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
					term: { term: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { term: "world", groups: ["group2"] },
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
						term: "hello world",
						groups: ["group1"],
						subTerms: [
							{ term: "hello", groups: ["group2"] },
							{ term: " ", groups: [], artificial: true },
							{ term: "world", groups: ["group3"] },
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
					term: { term: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { term: "hello", groups: ["group2"] },
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
					term: { term: "world", groups: ["group2"] },
					start: 6,
					end: 11,
				},
				{
					term: { term: "hello", groups: ["group1"] },
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
					term: { term: "hello", groups: ["group1"] },
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
						term: "hello world",
						groups: ["group1"],
						subTerms: [
							{ term: "hello", groups: ["group2"] },
							{ term: " ", groups: [], artificial: true },
							{ term: "world", groups: ["group3"] },
						],
					},
					start: 0,
					end: 11,
				},
			];

			const result = buildSubTermsPositionMap(overlappingGroup);

			expect(result).toEqual([
				{
					subTerm: { term: "hello", groups: ["group2"] },
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { term: " ", groups: [], artificial: true },
					start: 5,
					end: 6,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { term: "world", groups: ["group3"] },
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
						term: "hello world",
						groups: ["group1"],
						subTerms: [
							{ term: "hello", groups: ["group2"] },
							{ term: " world", groups: [], artificial: true },
						],
					},
					start: 0,
					end: 11,
				},
				{
					term: {
						term: "world peace",
						groups: ["group3"],
						subTerms: [
							{ term: "world", groups: ["group4"] },
							{ term: " peace", groups: [], artificial: true },
						],
					},
					start: 6,
					end: 17,
				},
			];

			const result = buildSubTermsPositionMap(overlappingGroup);

			expect(result).toEqual([
				{
					subTerm: { term: "hello", groups: ["group2"] },
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { term: " world", groups: [], artificial: true },
					start: 5,
					end: 11,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: { term: "world", groups: ["group4"] },
					start: 6,
					end: 11,
					fromTermGroups: ["group3"],
				},
				{
					subTerm: { term: " peace", groups: [], artificial: true },
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
					term: { term: "Prince Charles", groups: ["group1"] },
					start: 0,
					end: 14,
				},
				{
					term: { term: "Charles Xavier", groups: ["group2"] },
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
				{ term: "Prince ", groups: ["group1"], sourceTerm: "Prince Charles" },
				{ term: "Charles", groups: ["group1", "group2"], sourceTerm: null },
				{ term: " Xavier", groups: ["group2"], sourceTerm: "Charles Xavier" },
			]);
		});

		it("should include parent groups in segments", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { term: "hello world", groups: ["group1"] },
					start: 0,
					end: 11,
				},
				{
					term: { term: "world peace", groups: ["group2"] },
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
					term: "hello ",
					groups: ["group1", "parentGroup"],
					sourceTerm: "hello world",
				},
				{
					term: "world",
					groups: ["group1", "group2", "parentGroup"],
					sourceTerm: null,
				},
				{
					term: " peace",
					groups: ["group2", "parentGroup"],
					sourceTerm: "world peace",
				},
			]);
		});

		it("should handle terms with subTerms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						term: "New York",
						groups: ["group1"],
						subTerms: [
							{ term: "New ", groups: [], artificial: true },
							{ term: "York", groups: ["group2"] },
						],
					},
					start: 0,
					end: 8,
				},
				{
					term: { term: "York City", groups: ["group3"] },
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
					term: "New ",
					groups: ["group1"],
					sourceTerm: "New York",
					artificial: true,
				},
				{
					term: "York",
					groups: ["group1", "group3"],
					sourceTerm: null,
				},
				{ term: " City", groups: ["group3"], sourceTerm: "York City" },
			]);
		});

		it("should use allTerms for group computation", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { term: "hello world", groups: ["group1"] },
					start: 0,
					end: 11,
				},
			];
			const allTerms: TermWithPosition[] = [
				...overlappingGroup,
				{
					term: { term: "hello world!", groups: ["group2"] },
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
					term: "hello world",
					groups: ["group1", "group2"],
					sourceTerm: "hello world",
				},
			]);
		});

		it("should handle three overlapping terms", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { term: "A B C", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { term: "B C D", groups: ["group2"] },
					start: 2,
					end: 7,
				},
				{
					term: { term: "C D E", groups: ["group3"] },
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
				{ term: "A ", groups: ["group1"], sourceTerm: "A B C" },
				{ term: "B ", groups: ["group1", "group2"], sourceTerm: null },
				{ term: "C", groups: ["group1", "group2", "group3"], sourceTerm: null },
				{ term: " D", groups: ["group2", "group3"], sourceTerm: null },
				{ term: " E", groups: ["group3"], sourceTerm: "C D E" },
			]);
		});

		it("should handle completely overlapping terms with same boundaries", () => {
			const overlappingGroup: TermWithPosition[] = [
				{
					term: { term: "hello", groups: ["group1"] },
					start: 0,
					end: 5,
				},
				{
					term: { term: "hello", groups: ["group2"] },
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
				{ term: "hello", groups: ["group1", "group2"], sourceTerm: "hello" },
			]);
		});
	});
});
