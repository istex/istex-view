import { describe, expect, it } from "vitest";
import { isContainedIn, nestContainedTerms } from "./nestContainedTerms";

describe("nestContainedTerms", () => {
	describe("isContainedIn", () => {
		it("should return true when longerTerm contain shorter one ", () => {
			const longerTerm = {
				term: "cat lover",
				groups: ["group1"],
			};
			const shorterTerm = {
				term: "cat",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(true);
		});

		it("should return true when longerTerm contain shorter one with punctuation", () => {
			const longerTerm = {
				term: "hello, world!",
				groups: ["group1"],
			};
			const shorterTerm = {
				term: "world",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(true);
		});

		it("should return true when longerTerm contain shorterTerm between parentheses", () => {
			const longerTerm = {
				term: "example (test case)",
				groups: ["group1"],
			};
			const shorterTerm = {
				term: "test case",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(true);
		});

		it("should return false when longerTerm contain shorter one but they are of the same group", () => {
			const longerTerm = {
				term: "cat lover",
				groups: ["group1"],
			};
			const shorterTerm = {
				term: "cat",
				groups: ["group1"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(false);
		});

		it('should return false when longerTerm contain shorter one but shorter is not a full word (e.g., "conf" in "overconfident")', () => {
			const longerTerm = {
				term: "overconfident",
				groups: ["group1"],
			};
			const shorterTerm = {
				term: "conf",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(false);
		});

		it("should return false when both terms are identical", () => {
			const longerTerm = {
				term: "Paris",
				groups: ["group1"],
			};
			const shorterTerm = {
				term: "Paris",
				groups: ["group2"],
			};
			expect(isContainedIn(longerTerm, shorterTerm)).toBe(false);
		});
	});
	it("should nest contained terms correctly", () => {
		const terms = [
			{ term: "United States of America", groups: ["group1"] },

			{ term: "States of America", groups: ["group2"] },
			{ term: "America", groups: ["group3"] },
		];
		const nestedTerms = nestContainedTerms(terms);
		expect(nestedTerms).toEqual([
			{
				term: "America",
				groups: ["group3"],
			},
			{
				term: "States of America",
				groups: ["group2"],
				subTerms: [
					{
						term: "States of ",
						groups: ["group2"],
						artificial: true,
						sourceTerm: "States of America",
					},
					{
						term: "America",
						groups: ["group2", "group3"],
					},
				],
			},
			{
				term: "United States of America",
				groups: ["group1"],
				subTerms: [
					{
						term: "United ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "United States of America",
					},
					{
						term: "States of America",
						groups: ["group1", "group2"],
						subTerms: [
							{
								term: "States of ",
								groups: ["group1", "group2"],
								artificial: true,
								sourceTerm: "States of America",
							},
							{
								term: "America",
								groups: ["group1", "group2", "group3"],
							},
						],
					},
				],
			},
		]);
	});
});
