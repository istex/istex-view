import { describe, expect, it } from "vitest";
import {
	hasIdenticalTermInSubTerms,
	removeDuplicateNestedTerms,
} from "./removeDuplicateNestedTerms";

describe("removeDuplicateNestedTerms", () => {
	describe("hasIdenticalTermInSubTerms", () => {
		it("should return true when a term has an identical term in a list of subTerms", () => {
			const term = {
				targetText: "America",
				sourceTerm: ["America"],
				groups: ["group2"],
			};

			const subTerms = [
				{
					targetText: "States of America",
					sourceTerm: ["States of America"],
					groups: ["group3"],
				},
				{
					targetText: "America",
					sourceTerm: ["America"],
					groups: ["group2"],
				},
			];
			expect(hasIdenticalTermInSubTerms(term, subTerms)).toBe(true);
		});

		it("should return false when a term does not have an identical term in a list of subTerms", () => {
			const term = {
				targetText: "America",
				sourceTerm: ["America"],
				groups: ["group2"],
			};
			const subTerms = [
				{
					targetText: "States of America",
					sourceTerm: ["States of America"],
					groups: ["group3"],
				},
				{
					targetText: "United States",
					sourceTerm: ["United States"],
					groups: ["group1"],
				},
			];
			expect(hasIdenticalTermInSubTerms(term, subTerms)).toBe(false);
		});

		it("should return true when a term has an identical term in deeply nested list of subTerms", () => {
			const term = {
				targetText: " sec",
				sourceTerm: ["sec"],
				groups: ["group2"],
			};
			const subTerms = [
				{
					targetText: "Union ratatinée des saucissons sec",
					sourceTerm: ["Union ratatinée des saucissons sec"],
					groups: ["group3"],
					subTerms: [
						{
							targetText: "Union ratatinée",
							sourceTerm: ["Union ratatinée"],
							groups: ["group2"],
						},
						{
							targetText: " des ",
							sourceTerm: ["des"],
							groups: [],
						},
						{
							targetText: "saucissons sec",
							sourceTerm: ["saucissons sec"],
							groups: ["group1"],
							subTerms: [
								{
									targetText: "saucissons",
									sourceTerm: ["saucissons"],
									groups: ["group4"],
								},
								{
									targetText: " sec",
									sourceTerm: ["sec"],
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
				targetText: "United States of America",
				sourceTerm: ["United States of America"],
				groups: ["group1"],
				subTerms: [
					{
						targetText: "America",
						sourceTerm: ["America", "United States of America"],
						groups: ["group1", "group2"],
					},
					{
						targetText: "States of America",
						sourceTerm: ["States of America", "United States of America"],
						groups: ["group1", "group3"],
						subTerms: [
							{
								targetText: "America",
								sourceTerm: [
									"America",
									"States of America",
									"United States of America",
								],
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
				targetText: "United States of America",
				groups: ["group1"],
				subTerms: [
					{
						targetText: "States of America",
						groups: ["group1", "group3"],
						subTerms: [
							{
								targetText: "America",
								groups: ["group1", "group3", "group2"],
							},
						],
					},
				],
			},
		]);
	});
});
