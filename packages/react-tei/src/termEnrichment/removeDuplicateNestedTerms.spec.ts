import { describe, expect, it } from "vitest";
import {
	hasIdenticalTermInSubTerms,
	removeDuplicateNestedTerms,
} from "./removeDuplicateNestedTerms";

describe("removeDuplicateNestedTerms", () => {
	describe("hasIdenticalTermInSubTerms", () => {
		it("should return true when a term has an identical term in a list of subTerms", () => {
			const term = {
				term: "America",
				groups: ["group2"],
			};

			const subTerms = [
				{
					term: "States of America",
					groups: ["group3"],
				},
				{
					term: "America",
					groups: ["group2"],
				},
			];
			expect(hasIdenticalTermInSubTerms(term, subTerms)).toBe(true);
		});

		it("should return false when a term does not have an identical term in a list of subTerms", () => {
			const term = {
				term: "America",
				groups: ["group2"],
			};
			const subTerms = [
				{
					term: "States of America",
					groups: ["group3"],
				},
				{
					term: "United States",
					groups: ["group1"],
				},
			];
			expect(hasIdenticalTermInSubTerms(term, subTerms)).toBe(false);
		});

		it("should return true when a term has an identical term in deeply nested list of subTerms", () => {
			const term = {
				term: " sec",
				groups: ["group2"],
			};
			const subTerms = [
				{
					term: "Union ratatinée des saucissons sec",
					groups: ["group3"],
					subTerms: [
						{
							term: "Union ratatinée",
							groups: ["group2"],
						},
						{
							term: " des ",
							groups: [],
						},
						{
							term: "saucissons sec",
							groups: ["group1"],
							subTerms: [
								{
									term: "saucissons",
									groups: ["group4"],
								},
								{
									term: " sec",
									groups: [],
								},
							],
						},
					],
				},
			];
			expect(hasIdenticalTermInSubTerms(term, subTerms)).toBe(true);
		});
	});
	it("should remove duplicate nested terms that are identical to one of the descendant of their brother", () => {
		const terms = [
			{
				term: "United States of America",
				groups: ["group1"],
				subTerms: [
					{
						term: "America",
						groups: ["group1", "group2"],
					},
					{
						term: "States of America",
						groups: ["group1", "group3"],
						subTerms: [
							{
								term: "America",
								groups: ["group1", "group3", "group2"],
							},
						],
					},
				],
			},
		];

		const cleanedTerms = removeDuplicateNestedTerms(terms);
		expect(cleanedTerms).toEqual([
			{
				term: "United States of America",
				groups: ["group1"],
				subTerms: [
					{
						term: "States of America",
						groups: ["group1", "group3"],
						subTerms: [
							{
								term: "America",
								groups: ["group1", "group3", "group2"],
							},
						],
					},
				],
			},
		]);
	});
});
