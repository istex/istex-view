import { describe, expect, it } from "vitest";
import {
	computeNonArtificialGroups,
	createSegmentFromBoundary,
} from "./createSegmentFromBoundary";
import type { SubTermAtPosition, TermWithPosition } from "./types";

describe("createSegmentFromBoundary", () => {
	describe("computeNonArtificialGroups", () => {
		it("should return parent groups when no covering terms", () => {
			const coveringTerms: TermWithPosition[] = [];
			const parentGroups = ["group1", "group2"];

			const result = computeNonArtificialGroups(coveringTerms, parentGroups);

			expect(result).toEqual(["group1", "group2"]);
		});

		it("should filter out groups from artificial terms", () => {
			const coveringTerms: TermWithPosition[] = [
				{
					term: {
						targetText: "artificial",
						groups: ["artificialGroup"],
						artificial: true,
						sourceTerm: [],
					},
					start: 0,
					end: 10,
				},
				{
					term: { targetText: "real", groups: ["realGroup"], sourceTerm: [] },
					start: 0,
					end: 10,
				},
			];
			const parentGroups = ["parentGroup"];

			const result = computeNonArtificialGroups(coveringTerms, parentGroups);

			expect(result).toEqual(["parentGroup", "realGroup"]);
		});

		it("should deduplicate and sort groups", () => {
			const coveringTerms: TermWithPosition[] = [
				{
					term: {
						targetText: "term1",
						groups: ["group2", "group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 10,
				},
				{
					term: {
						targetText: "term2",
						groups: ["group3", "group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 10,
				},
			];
			const parentGroups = ["group1", "group4"];

			const result = computeNonArtificialGroups(coveringTerms, parentGroups);

			expect(result).toEqual(["group1", "group2", "group3", "group4"]);
		});

		it("should return only parent groups when all covering terms are artificial", () => {
			const coveringTerms: TermWithPosition[] = [
				{
					term: {
						targetText: "artificial1",
						groups: ["group1"],
						artificial: true,
						sourceTerm: [],
					},
					start: 0,
					end: 10,
				},
				{
					term: {
						targetText: "artificial2",
						groups: ["group2"],
						artificial: true,
						sourceTerm: [],
					},
					start: 0,
					end: 10,
				},
			];
			const parentGroups = ["parentGroup"];

			const result = computeNonArtificialGroups(coveringTerms, parentGroups);

			expect(result).toEqual(["parentGroup"]);
		});
	});

	describe("createSegmentFromBoundary", () => {
		it("should return null for empty segment text", () => {
			const result = createSegmentFromBoundary(
				0,
				0,
				"container",
				[],
				[],
				[],
				[],
			);

			expect(result).toBeNull();
		});

		it("should create filler text segment when no covering terms from overlapping group", () => {
			const containerTerm = "hello world";
			const parentGroups = ["parentGroup"];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				[], // no overlapping group terms
				[],
				[],
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["parentGroup"],
				artificial: true,
				sourceTerm: [],
			});
		});

		it("should create segment from covering terms when no exact subTerm match", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms = overlappingGroup;
			const parentGroups = ["parentGroup"];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				[],
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1", "parentGroup"],
				sourceTerm: ["hello world"],
			});
		});

		it("should merge properties from matching subTerms", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms = overlappingGroup;
			const subTermsByPosition: SubTermAtPosition[] = [
				{
					subTerm: {
						targetText: "hello",
						groups: ["subGroup"],
						sourceTerm: [],
					},
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
			];
			const parentGroups = ["parentGroup"];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				subTermsByPosition,
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1", "parentGroup"],
				sourceTerm: ["hello world"],
			});
		});

		it("should use only non-artificial groups for artificial subTerms", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms = overlappingGroup;
			const subTermsByPosition: SubTermAtPosition[] = [
				{
					subTerm: {
						targetText: "hello",
						groups: [],
						artificial: true,
						sourceTerm: [],
					},
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
			];
			const parentGroups = ["parentGroup"];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				subTermsByPosition,
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1"],
				sourceTerm: ["hello world"],
				artificial: true,
			});
		});

		it("should propagate groups to nested subTerms", () => {
			const containerTerm = "United States";
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "United States",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 13,
				},
			];
			const allTerms = overlappingGroup;
			const subTermsByPosition: SubTermAtPosition[] = [
				{
					subTerm: {
						targetText: "United States",
						groups: ["group2"],
						subTerms: [
							{
								targetText: "United ",
								groups: [],
								artificial: true,
								sourceTerm: ["United States"],
							},
							{
								targetText: "States",
								groups: ["group3"],
								sourceTerm: ["States"],
							},
						],
						sourceTerm: [],
					},
					start: 0,
					end: 13,
					fromTermGroups: ["group2"],
				},
			];
			const parentGroups: string[] = [];

			const result = createSegmentFromBoundary(
				0,
				13,
				containerTerm,
				overlappingGroup,
				allTerms,
				subTermsByPosition,
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "United States",
				groups: ["group1"],
				sourceTerm: ["United States"],
				subTerms: [
					{
						targetText: "United ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: ["United States"],
					},
					{
						targetText: "States",
						groups: ["group1", "group3"],
						sourceTerm: ["States"],
					},
				],
			});
		});

		it("should return null sourceTerm when covering terms have different term values", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
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
					term: {
						targetText: "hello world!",
						groups: ["group2"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms = overlappingGroup;
			const parentGroups: string[] = [];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				[],
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1", "group2"],
				sourceTerm: ["hello world", "hello world!"],
			});
		});

		it("should compute sourceTerm only from non-artificial terms", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
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
					term: {
						targetText: "different",
						groups: ["group2"],
						artificial: true,
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms = overlappingGroup;
			const parentGroups: string[] = [];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				[],
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1"],
				sourceTerm: ["hello world"],
			});
		});

		it("should handle multiple matching subTerms by using the first one", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms = overlappingGroup;
			const subTermsByPosition: SubTermAtPosition[] = [
				{
					subTerm: {
						targetText: "hello",
						groups: ["subGroup1"],
						sourceTerm: [],
					},
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
				{
					subTerm: {
						targetText: "hello",
						groups: ["subGroup2"],
						sourceTerm: [],
					},
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
			];
			const parentGroups: string[] = [];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				subTermsByPosition,
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1"],
				sourceTerm: ["hello world"],
			});
		});

		it("should not include empty subTerms array in result", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms = overlappingGroup;
			const subTermsByPosition: SubTermAtPosition[] = [
				{
					subTerm: {
						targetText: "hello",
						groups: ["subGroup"],
						subTerms: [],
						sourceTerm: [],
					},
					start: 0,
					end: 5,
					fromTermGroups: ["group1"],
				},
			];
			const parentGroups: string[] = [];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				subTermsByPosition,
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1"],
				sourceTerm: ["hello world"],
			});
			expect(result).not.toHaveProperty("subTerms");
		});

		it("should use all covering terms for group computation, not just overlapping group", () => {
			const containerTerm = "hello world";
			const overlappingGroup: TermWithPosition[] = [
				{
					term: {
						targetText: "hello world",
						groups: ["group1"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const allTerms: TermWithPosition[] = [
				...overlappingGroup,
				{
					term: {
						targetText: "hello world!",
						groups: ["group2"],
						sourceTerm: [],
					},
					start: 0,
					end: 11,
				},
			];
			const parentGroups: string[] = [];

			const result = createSegmentFromBoundary(
				0,
				5,
				containerTerm,
				overlappingGroup,
				allTerms,
				[],
				parentGroups,
			);

			expect(result).toEqual({
				targetText: "hello",
				groups: ["group1", "group2"],
				sourceTerm: ["hello world"],
			});
		});
	});
});
