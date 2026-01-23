import { describe, expect, it } from "vitest";
import { propagateGroupsToSubTerm } from "./propagateGroupsToSubTerm";
import type { NestedTerm } from "./types";

describe("propagateGroupsToSubTerm", () => {
	it("should combine parent groups with subTerm groups", () => {
		const subTerm: NestedTerm = {
			targetText: "America",
			groups: ["group2"],
		};
		const parentGroups = ["group1"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "America",
			groups: ["group1", "group2"],
		});
	});

	it("should deduplicate groups when parent and subTerm share groups", () => {
		const subTerm: NestedTerm = {
			targetText: "America",
			groups: ["group1", "group2"],
		};
		const parentGroups = ["group1", "group3"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "America",
			groups: ["group1", "group3", "group2"],
		});
	});

	it("should deduplicate groups when parent and subTerm share groups ordering by group from parent first", () => {
		const subTerm: NestedTerm = {
			targetText: "America",
			groups: ["group2", "group1"],
		};
		const parentGroups = ["group1", "group3"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "America",
			groups: ["group1", "group3", "group2"],
		});
	});

	it("should propagate groups recursively to nested subTerms", () => {
		const subTerm: NestedTerm = {
			targetText: "States of America",
			groups: ["group2"],
			subTerms: [
				{ targetText: "States of ", groups: [], artificial: true },
				{ targetText: "America", groups: ["group3"] },
			],
		};
		const parentGroups = ["group1"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "States of America",
			groups: ["group1", "group2"],
			subTerms: [
				{
					targetText: "States of ",
					groups: ["group1", "group2"],
					artificial: true,
				},
				{ targetText: "America", groups: ["group1", "group2", "group3"] },
			],
		});
	});

	it("should propagate groups through multiple levels of nesting", () => {
		const subTerm: NestedTerm = {
			targetText: "United States of America",
			groups: ["group1"],
			subTerms: [
				{ targetText: "United ", groups: [], artificial: true },
				{
					targetText: "States of America",
					groups: ["group2"],
					subTerms: [
						{ targetText: "States of ", groups: [], artificial: true },
						{ targetText: "America", groups: ["group3"] },
					],
				},
			],
		};
		const parentGroups: string[] = [];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "United States of America",
			groups: ["group1"],
			subTerms: [
				{ targetText: "United ", groups: ["group1"], artificial: true },
				{
					targetText: "States of America",
					groups: ["group1", "group2"],
					subTerms: [
						{
							targetText: "States of ",
							groups: ["group1", "group2"],
							artificial: true,
						},
						{ targetText: "America", groups: ["group1", "group2", "group3"] },
					],
				},
			],
		});
	});

	it("should handle subTerm with empty groups", () => {
		const subTerm: NestedTerm = {
			targetText: "some text",
			groups: [],
			artificial: true,
		};
		const parentGroups = ["group1", "group2"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "some text",
			groups: ["group1", "group2"],
			artificial: true,
		});
	});

	it("should handle empty parent groups", () => {
		const subTerm: NestedTerm = {
			targetText: "America",
			groups: ["group1"],
		};
		const parentGroups: string[] = [];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "America",
			groups: ["group1"],
		});
	});

	it("should preserve other properties like artificial and sourceTerm", () => {
		const subTerm: NestedTerm = {
			targetText: "some text",
			groups: ["group2"],
			artificial: true,
			sourceTerm: "original term",
		};
		const parentGroups = ["group1"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			targetText: "some text",
			groups: ["group1", "group2"],
			artificial: true,
			sourceTerm: "original term",
		});
	});

	it("should not mutate the original subTerm", () => {
		const subTerm: NestedTerm = {
			targetText: "America",
			groups: ["group2"],
			subTerms: [{ targetText: "nested", groups: ["group3"] }],
		};
		const parentGroups = ["group1"];

		propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(subTerm.groups).toEqual(["group2"]);
		expect(subTerm.subTerms?.[0]?.groups).toEqual(["group3"]);
	});
});
