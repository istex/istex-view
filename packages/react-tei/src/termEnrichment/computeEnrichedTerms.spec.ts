import { describe, expect, it } from "vitest";
import { computeEnrichedTerms } from "./computeEnrichedTerms";

describe("computeEnrichedTerms", () => {
	it('should regroup identical terms from different groups (e.g., "cat" from group1 and group2)', () => {
		const termByGroup = {
			group1: [{ term: "cat", displayed: true }],
			group2: [{ term: "cat", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{ targetText: "cat", groups: ["group1", "group2"] },
		]);
	});

	it("should compute enriched terms with regrouped identical terms and nested contained terms", () => {
		const termByGroup = {
			group1: [
				{
					term: "France Organization of cat lover",
					displayed: true,
				},
			],
			group2: [
				{ term: "cat", displayed: true },
				{ term: "dog", displayed: true },
			],
			group3: [
				{ term: "France", displayed: true },
				{ term: "cat", displayed: true },
			],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "France Organization of cat lover",
				groups: ["group1"],
				subTerms: [
					{
						targetText: "France",
						groups: ["group1", "group3"],
					},
					{
						targetText: " Organization of ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "France Organization of cat lover",
					},
					{
						targetText: "cat",
						groups: ["group1", "group2", "group3"],
					},
					{
						targetText: " lover",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "France Organization of cat lover",
					},
				],
			},
			{
				targetText: "France",
				groups: ["group3"],
			},
			{
				targetText: "cat",
				groups: ["group2", "group3"],
			},
			{
				targetText: "dog",
				groups: ["group2"],
			},
		]);
	});

	it('should handle nested terms correctly (e.g., "New York City" containing "York")', () => {
		const termByGroup = {
			group1: [{ term: "New York City", displayed: true }],
			group2: [{ term: "York", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "New York City",
				groups: ["group1"],
				subTerms: [
					{
						targetText: "New ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "New York City",
					},

					{
						targetText: "York",
						groups: ["group1", "group2"],
					},
					{
						targetText: " City",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "New York City",
					},
				],
			},
			{
				targetText: "York",
				groups: ["group2"],
			},
		]);
	});

	it("should ignore nesting when terms are not words", () => {
		const termByGroup = {
			group1: [{ term: "overconfident", displayed: true }],
			group2: [{ term: "conf", displayed: true }],
		};
		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "overconfident",
				groups: ["group1"],
			},
			{
				targetText: "conf",
				groups: ["group2"],
			},
		]);
	});

	it("should ignore overlapping terms that have no words in common", () => {
		const termByGroup = {
			group1: [{ term: "concat", displayed: true }],
			group2: [{ term: "catastrophic", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "catastrophic",
				groups: ["group2"],
			},
			{
				targetText: "concat",
				groups: ["group1"],
			},
		]);
	});

	it("should handle multiple sub-terms", () => {
		const termByGroup = {
			group1: [{ term: "San Francisco Bay Area", displayed: true }],
			group2: [{ term: "San Francisco", displayed: true }],
			group3: [{ term: "Bay Area", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "San Francisco Bay Area",
				groups: ["group1"],
				subTerms: [
					{
						targetText: "San Francisco",
						groups: ["group1", "group2"],
					},
					{
						targetText: " ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "San Francisco Bay Area",
					},
					{
						targetText: "Bay Area",
						groups: ["group1", "group3"],
					},
				],
			},
			{
				targetText: "San Francisco",
				groups: ["group2"],
			},
			{
				targetText: "Bay Area",
				groups: ["group3"],
			},
		]);
	});

	it("should handle terms deeply nested terms", () => {
		const termByGroup = {
			group1: [
				{
					term: "Union ratatinée des saucisson sec",
					displayed: true,
				},
			],
			group2: [{ term: "saucisson sec", displayed: true }],
			group3: [{ term: "saucisson", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "Union ratatinée des saucisson sec",
				groups: ["group1"],
				subTerms: [
					{
						targetText: "Union ratatinée des ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "Union ratatinée des saucisson sec",
					},
					{
						targetText: "saucisson sec",
						groups: ["group1", "group2"],
						subTerms: [
							{
								groups: ["group1", "group2", "group3"],
								targetText: "saucisson",
							},
							{
								groups: ["group1", "group2"],
								artificial: true,
								targetText: " sec",
								sourceTerm: "saucisson sec",
							},
						],
					},
				],
			},
			{
				targetText: "saucisson sec",
				groups: ["group2"],
				subTerms: [
					{
						targetText: "saucisson",
						groups: ["group2", "group3"],
					},
					{
						groups: ["group2"],
						artificial: true,
						targetText: " sec",
						sourceTerm: "saucisson sec",
					},
				],
			},
			{
				targetText: "saucisson",
				groups: ["group3"],
			},
		]);
	});

	it("should nest terms that are in the same group", () => {
		const termByGroup = {
			group1: [
				{ term: "cat lover", displayed: true },
				{ term: "cat", displayed: true },
			],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "cat lover",
				groups: ["group1"],
				subTerms: [
					{
						groups: ["group1"],
						targetText: "cat",
					},
					{
						artificial: true,
						groups: ["group1"],
						sourceTerm: "cat lover",
						targetText: " lover",
					},
				],
			},
			{ targetText: "cat", groups: ["group1"] },
		]);
	});

	it("should nest terms that are in the same group, while leaving occurence outside of the group un-nested", () => {
		const termByGroup = {
			group1: [
				{ term: "United States of America", displayed: true },
				{ term: "America", displayed: true },
			],
			group2: [{ term: "America", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "United States of America",
				groups: ["group1"],
				subTerms: [
					{
						targetText: "United States of ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "United States of America",
					},
					{
						targetText: "America",
						groups: ["group1", "group2"],
					},
				],
			},
			{
				targetText: "America",
				groups: ["group1", "group2"],
			},
		]);
	});

	it('should handle overlapping terms from the same group correctly (e.g., "Prince Charles" and "Charles Xavier")', () => {
		const termByGroup = {
			group1: [
				{ term: "Prince Charles", displayed: true },
				{ term: "Charles Xavier", displayed: true },
			],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "Prince Charles Xavier",
				groups: ["group1+group1"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1"],
						targetText: "Prince ",
						sourceTerm: "Prince Charles",
					},
					{
						groups: ["group1"],
						targetText: "Charles",
						sourceTerm: null,
					},
					{
						groups: ["group1"],
						targetText: " Xavier",
						sourceTerm: "Charles Xavier",
					},
				],
			},
			{
				groups: ["group1"],
				targetText: "Prince Charles",
			},
			{
				groups: ["group1"],
				targetText: "Charles Xavier",
			},
		]);
	});

	it("should handle complex overlapping", () => {
		const termByGroup = {
			group1: [{ term: "Prince Charles", displayed: true }],
			group2: [{ term: "Charles The Bold", displayed: true }],
			group3: [{ term: "The Bold Font", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "Prince Charles The Bold Font",
				groups: ["group1+group2+group3"],
				artificial: true,
				subTerms: [
					{
						targetText: "Prince ",
						sourceTerm: "Prince Charles",
						groups: ["group1"],
					},
					{
						targetText: "Charles",
						groups: ["group1", "group2"],
						sourceTerm: null,
					},
					{
						targetText: " ",
						sourceTerm: "Charles The Bold",
						groups: ["group2"],
					},
					{
						targetText: "The Bold",
						sourceTerm: null,
						groups: ["group2", "group3"],
					},
					{
						targetText: " Font",
						sourceTerm: "The Bold Font",
						groups: ["group3"],
					},
				],
			},
			{
				targetText: "Prince Charles The Bold",
				groups: ["group1+group2"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1"],
						targetText: "Prince ",
						sourceTerm: "Prince Charles",
					},
					{
						groups: ["group1", "group2"],
						targetText: "Charles",
						sourceTerm: null,
					},
					{
						groups: ["group2"],
						sourceTerm: "Charles The Bold",
						targetText: " The Bold",
					},
				],
			},
			{
				targetText: "Charles The Bold Font",
				groups: ["group2+group3"],
				artificial: true,
				subTerms: [
					{
						groups: ["group2"],
						sourceTerm: "Charles The Bold",
						targetText: "Charles ",
					},
					{
						groups: ["group2", "group3"],
						sourceTerm: null,
						targetText: "The Bold",
					},
					{
						groups: ["group3"],
						sourceTerm: "The Bold Font",
						targetText: " Font",
					},
				],
			},
			{
				groups: ["group2"],
				targetText: "Charles The Bold",
			},
			{
				groups: ["group1"],
				targetText: "Prince Charles",
			},
			{
				groups: ["group3"],
				targetText: "The Bold Font",
			},
		]);
	});

	it("should handle everything at once", () => {
		const termByGroup = {
			group1: [
				{ term: "United Nations", displayed: true },
				{ term: "Gamers United", displayed: true },
			],
			group3: [{ term: "United States", displayed: true }],
			group2: [{ term: "States", displayed: true }],
			group4: [
				{ term: "United", displayed: true },
				{ term: "States", displayed: true },
				{ term: "Nations", displayed: true },
				{ term: "Gamers", displayed: true },
			],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{
				targetText: "Gamers United Nations",
				groups: ["group1+group1"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1", "group4"],
						targetText: "Gamers",
						sourceTerm: ["Gamers United"],
					},
					{
						artificial: true,
						groups: ["group1"],
						targetText: " ",
						sourceTerm: ["Gamers United"],
					},
					{
						groups: ["group1", "group4"],
						targetText: "United",
						sourceTerm: ["Gamers United", "United Nations"],
					},
					{
						artificial: true,
						groups: ["group1"],
						targetText: " ",
						sourceTerm: ["United Nations"],
					},
					{
						groups: ["group1", "group4"],
						targetText: "Nations",
						sourceTerm: ["United Nations"],
					},
				],
			},
			{
				targetText: "Gamers United States",
				groups: ["group1+group3"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1", "group4"],
						targetText: "Gamers",
						sourceTerm: "Gamers United",
					},
					{
						artificial: true,
						groups: ["group1"],
						targetText: " ",
						sourceTerm: "Gamers United",
					},
					{
						groups: ["group1", "group3", "group4"],
						targetText: "United",
						sourceTerm: null,
					},
					{
						artificial: true,
						groups: ["group3"],
						targetText: " ",
						sourceTerm: ["United States"],
					},
					{
						groups: ["group2", "group3", "group4"],
						targetText: "States",
						sourceTerm: ["United States"],
					},
				],
			},
			{
				targetText: "United Nations",
				groups: ["group1"],
				subTerms: [
					{
						groups: ["group1", "group4"],
						targetText: "United",
					},
					{
						artificial: true,
						groups: ["group1"],
						targetText: " ",
						sourceTerm: ["United Nations"],
					},
					{
						groups: ["group1", "group4"],
						targetText: "Nations",
					},
				],
			},
			{
				targetText: "Gamers United",
				groups: ["group1"],
				subTerms: [
					{
						groups: ["group1", "group4"],
						targetText: "Gamers",
					},
					{
						artificial: true,
						groups: ["group1"],
						targetText: " ",
						sourceTerm: ["Gamers United"],
					},
					{
						groups: ["group1", "group4"],
						targetText: "United",
					},
				],
			},
			{
				targetText: "United States",
				groups: ["group3"],
				subTerms: [
					{
						targetText: "United",
						groups: ["group3", "group4"],
					},
					{
						targetText: " ",
						artificial: true,
						groups: ["group3"],
						sourceTerm: "United States",
					},
					{
						targetText: "States",
						groups: ["group3", "group2", "group4"],
					},
				],
			},
			{
				groups: ["group4"],
				targetText: "Nations",
			},
			{
				groups: ["group2", "group4"],
				targetText: "States",
			},
			{
				groups: ["group4"],
				targetText: "United",
			},
			{
				groups: ["group4"],
				targetText: "Gamers",
			},
		]);
	});

	it("should handle empty input correctly", () => {
		const termByGroup = {};

		const terms = computeEnrichedTerms(termByGroup);
		expect(terms).toEqual([]);
	});
});
