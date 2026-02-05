import { describe, expect, it } from "vitest";
import { isContainedIn, nestContainedTerms } from "./nestContainedTerms";

describe("nestContainedTerms", () => {
	describe("isContainedIn", () => {
		it("should return true when longerTerm contain shorter one ", () => {
			const longerTerm = {
				targetText: "cat lover",
				groups: ["group1"],
			};
			const shorterTerm = {
				targetText: "cat",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(true);
		});

		it("should return true when longerTerm contain shorter one with punctuation", () => {
			const longerTerm = {
				targetText: "hello, world!",
				groups: ["group1"],
			};
			const shorterTerm = {
				targetText: "world",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(true);
		});

		it("should return true when longerTerm contain shorterTerm between parentheses", () => {
			const longerTerm = {
				targetText: "example (test case)",
				groups: ["group1"],
			};
			const shorterTerm = {
				targetText: "test case",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(true);
		});

		it('should return false when longerTerm contain shorter one but shorter is not a full word (e.g., "conf" in "overconfident")', () => {
			const longerTerm = {
				targetText: "overconfident",
				groups: ["group1"],
			};
			const shorterTerm = {
				targetText: "conf",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(false);
		});

		it("should return false when both terms are identical", () => {
			const longerTerm = {
				targetText: "Paris",
				groups: ["group1"],
			};
			const shorterTerm = {
				targetText: "Paris",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(false);
		});
	});
	it("should nest contained terms correctly", () => {
		const terms = [
			{ targetText: "United States of America", groups: ["group1"] },

			{ targetText: "States of America", groups: ["group2"] },
			{ targetText: "America", groups: ["group3"] },
		];
		const nestedTerms = nestContainedTerms(terms);
		expect(nestedTerms).toEqual([
			{
				targetText: "America",
				groups: ["group3"],
			},
			{
				targetText: "States of America",
				groups: ["group2"],
				subTerms: [
					{
						targetText: "States of ",
						groups: ["group2"],
						artificial: true,
						sourceTerm: "States of America",
					},
					{
						targetText: "America",
						groups: ["group2", "group3"],
					},
				],
			},
			{
				targetText: "United States of America",
				groups: ["group1"],
				subTerms: [
					{
						targetText: "United ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "United States of America",
					},
					{
						targetText: "States of America",
						groups: ["group1", "group2"],
						subTerms: [
							{
								targetText: "States of ",
								groups: ["group1", "group2"],
								artificial: true,
								sourceTerm: "States of America",
							},
							{
								targetText: "America",
								groups: ["group1", "group2", "group3"],
							},
						],
					},
				],
			},
		]);
	});
});
