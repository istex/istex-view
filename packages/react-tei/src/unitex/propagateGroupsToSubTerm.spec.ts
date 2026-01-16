import { describe, expect, it } from "vitest";
import { propagateGroupsToSubTerm } from "./propagateGroupsToSubTerm";
import type { NestedTerm } from "./types";

describe("propagateGroupsToSubTerm", () => {
	it("should combine parent groups with subTerm groups", () => {
		const subTerm: NestedTerm = {
			term: "America",
			groups: ["group2"],
		};
		const parentGroups = ["group1"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "America",
			groups: ["group1", "group2"],
		});
	});

	it("should deduplicate groups when parent and subTerm share groups", () => {
		const subTerm: NestedTerm = {
			term: "America",
			groups: ["group1", "group2"],
		};
		const parentGroups = ["group1", "group3"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "America",
			groups: ["group1", "group3", "group2"],
		});
	});

	it("should deduplicate groups when parent and subTerm share groups ordering by group from parent first", () => {
		const subTerm: NestedTerm = {
			term: "America",
			groups: ["group2", "group1"],
		};
		const parentGroups = ["group1", "group3"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "America",
			groups: ["group1", "group3", "group2"],
		});
	});

	it("should propagate groups recursively to nested subTerms", () => {
		const subTerm: NestedTerm = {
			term: "States of America",
			groups: ["group2"],
			subTerms: [
				{ term: "States of ", groups: [], artificial: true },
				{ term: "America", groups: ["group3"] },
			],
		};
		const parentGroups = ["group1"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "States of America",
			groups: ["group1", "group2"],
			subTerms: [
				{ term: "States of ", groups: ["group1", "group2"], artificial: true },
				{ term: "America", groups: ["group1", "group2", "group3"] },
			],
		});
	});

	it("should propagate groups through multiple levels of nesting", () => {
		const subTerm: NestedTerm = {
			term: "United States of America",
			groups: ["group1"],
			subTerms: [
				{ term: "United ", groups: [], artificial: true },
				{
					term: "States of America",
					groups: ["group2"],
					subTerms: [
						{ term: "States of ", groups: [], artificial: true },
						{ term: "America", groups: ["group3"] },
					],
				},
			],
		};
		const parentGroups: string[] = [];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "United States of America",
			groups: ["group1"],
			subTerms: [
				{ term: "United ", groups: ["group1"], artificial: true },
				{
					term: "States of America",
					groups: ["group1", "group2"],
					subTerms: [
						{
							term: "States of ",
							groups: ["group1", "group2"],
							artificial: true,
						},
						{ term: "America", groups: ["group1", "group2", "group3"] },
					],
				},
			],
		});
	});

	it("should handle subTerm with empty groups", () => {
		const subTerm: NestedTerm = {
			term: "some text",
			groups: [],
			artificial: true,
		};
		const parentGroups = ["group1", "group2"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "some text",
			groups: ["group1", "group2"],
			artificial: true,
		});
	});

	it("should handle empty parent groups", () => {
		const subTerm: NestedTerm = {
			term: "America",
			groups: ["group1"],
		};
		const parentGroups: string[] = [];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "America",
			groups: ["group1"],
		});
	});

	it("should preserve other properties like artificial and sourceTerm", () => {
		const subTerm: NestedTerm = {
			term: "some text",
			groups: ["group2"],
			artificial: true,
			sourceTerm: "original term",
		};
		const parentGroups = ["group1"];

		const result = propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(result).toEqual({
			term: "some text",
			groups: ["group1", "group2"],
			artificial: true,
			sourceTerm: "original term",
		});
	});

	it("should not mutate the original subTerm", () => {
		const subTerm: NestedTerm = {
			term: "America",
			groups: ["group2"],
			subTerms: [{ term: "nested", groups: ["group3"] }],
		};
		const parentGroups = ["group1"];

		propagateGroupsToSubTerm(subTerm, parentGroups);

		expect(subTerm.groups).toEqual(["group2"]);
		expect(subTerm.subTerms?.[0]?.groups).toEqual(["group3"]);
	});
});
