import { describe, expect, it } from "vitest";
import { computeEnrichedTerms } from "./computeEnrichedTerms";

describe("computeEnrichedTerms", () => {
	it('should regroup identical terms from different groups (e.g., "cat" from group1 and group2)', () => {
		const termByGroup = {
			group1: [{ term: "cat", displayed: true }],
			group2: [{ term: "cat", displayed: true }],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([{ term: "cat", groups: ["group1", "group2"] }]);
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
				term: "France Organization of cat lover",
				groups: ["group1"],
				subTerms: [
					{
						term: "France",
						groups: ["group1", "group3"],
					},
					{
						term: " Organization of ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "France Organization of cat lover",
					},
					{
						term: "cat",
						groups: ["group1", "group2", "group3"],
					},
					{
						term: " lover",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "France Organization of cat lover",
					},
				],
			},
			{
				term: "France",
				groups: ["group3"],
			},
			{
				term: "cat",
				groups: ["group2", "group3"],
			},
			{
				term: "dog",
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
				term: "New York City",
				groups: ["group1"],
				subTerms: [
					{
						term: "New ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "New York City",
					},

					{
						term: "York",
						groups: ["group1", "group2"],
					},
					{
						term: " City",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "New York City",
					},
				],
			},
			{
				term: "York",
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
				term: "overconfident",
				groups: ["group1"],
			},
			{
				term: "conf",
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
				term: "catastrophic",
				groups: ["group2"],
			},
			{
				term: "concat",
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
				term: "San Francisco Bay Area",
				groups: ["group1"],
				subTerms: [
					{
						term: "San Francisco",
						groups: ["group1", "group2"],
					},
					{
						term: " ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "San Francisco Bay Area",
					},
					{
						term: "Bay Area",
						groups: ["group1", "group3"],
					},
				],
			},
			{
				term: "San Francisco",
				groups: ["group2"],
			},
			{
				term: "Bay Area",
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
				term: "Union ratatinée des saucisson sec",
				groups: ["group1"],
				subTerms: [
					{
						term: "Union ratatinée des ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "Union ratatinée des saucisson sec",
					},
					{
						term: "saucisson sec",
						groups: ["group1", "group2"],
						subTerms: [
							{
								groups: ["group1", "group2", "group3"],
								term: "saucisson",
							},
							{
								groups: ["group1", "group2"],
								artificial: true,
								term: " sec",
								sourceTerm: "saucisson sec",
							},
						],
					},
				],
			},
			{
				term: "saucisson sec",
				groups: ["group2"],
				subTerms: [
					{
						term: "saucisson",
						groups: ["group2", "group3"],
					},
					{
						groups: ["group2"],
						artificial: true,
						term: " sec",
						sourceTerm: "saucisson sec",
					},
				],
			},
			{
				term: "saucisson",
				groups: ["group3"],
			},
		]);
	});

	it("should not nest terms that are in the same group", () => {
		const termByGroup = {
			group1: [
				{ term: "cat lover", displayed: true },
				{ term: "cat", displayed: true },
			],
		};

		const terms = computeEnrichedTerms(termByGroup);

		expect(terms).toEqual([
			{ term: "cat lover", groups: ["group1"] },
			{ term: "cat", groups: ["group1"] },
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
				term: "United States of America",
				groups: ["group1"],
				subTerms: [
					{
						term: "United States of ",
						groups: ["group1"],
						artificial: true,
						sourceTerm: "United States of America",
					},
					{
						term: "America",
						groups: ["group1", "group2"],
					},
				],
			},
			{
				term: "America",
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
				term: "Prince Charles Xavier",
				groups: ["group1+group1"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1"],
						term: "Prince ",
						sourceTerm: "Prince Charles",
					},
					{
						groups: ["group1"],
						term: "Charles",
						sourceTerm: null,
					},
					{
						groups: ["group1"],
						term: " Xavier",
						sourceTerm: "Charles Xavier",
					},
				],
			},
			{
				groups: ["group1"],
				term: "Prince Charles",
			},
			{
				groups: ["group1"],
				term: "Charles Xavier",
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
				term: "Prince Charles The Bold Font",
				groups: ["group1+group2+group3"],
				artificial: true,
				subTerms: [
					{
						term: "Prince ",
						sourceTerm: "Prince Charles",
						groups: ["group1"],
					},
					{
						term: "Charles",
						groups: ["group1", "group2"],
						sourceTerm: null,
					},
					{
						term: " ",
						sourceTerm: "Charles The Bold",
						groups: ["group2"],
					},
					{
						term: "The Bold",
						sourceTerm: null,
						groups: ["group2", "group3"],
					},
					{
						term: " Font",
						sourceTerm: "The Bold Font",
						groups: ["group3"],
					},
				],
			},
			{
				term: "Prince Charles The Bold",
				groups: ["group1+group2"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1"],
						term: "Prince ",
						sourceTerm: "Prince Charles",
					},
					{
						groups: ["group1", "group2"],
						term: "Charles",
						sourceTerm: null,
					},
					{
						groups: ["group2"],
						sourceTerm: "Charles The Bold",
						term: " The Bold",
					},
				],
			},
			{
				term: "Charles The Bold Font",
				groups: ["group2+group3"],
				artificial: true,
				subTerms: [
					{
						groups: ["group2"],
						sourceTerm: "Charles The Bold",
						term: "Charles ",
					},
					{
						groups: ["group2", "group3"],
						sourceTerm: null,
						term: "The Bold",
					},
					{
						groups: ["group3"],
						sourceTerm: "The Bold Font",
						term: " Font",
					},
				],
			},
			{
				groups: ["group2"],
				term: "Charles The Bold",
			},
			{
				groups: ["group1"],
				term: "Prince Charles",
			},
			{
				groups: ["group3"],
				term: "The Bold Font",
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
				term: "Gamers United Nations",
				groups: ["group1+group1"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1", "group4"],
						term: "Gamers",
						sourceTerm: "Gamers United",
					},
					{
						artificial: true,
						groups: ["group1"],
						term: " ",
						sourceTerm: "Gamers United",
					},
					{
						groups: ["group1", "group4"],
						term: "United",
						sourceTerm: null,
					},
					{
						artificial: true,
						groups: ["group1"],
						term: " ",
						sourceTerm: "United Nations",
					},
					{
						groups: ["group1", "group4"],
						term: "Nations",
						sourceTerm: "United Nations",
					},
				],
			},
			{
				term: "Gamers United States",
				groups: ["group1+group3"],
				artificial: true,
				subTerms: [
					{
						groups: ["group1", "group4"],
						term: "Gamers",
						sourceTerm: "Gamers United",
					},
					{
						artificial: true,
						groups: ["group1"],
						term: " ",
						sourceTerm: "Gamers United",
					},
					{
						groups: ["group1", "group3", "group4"],
						term: "United",
						sourceTerm: null,
					},
					{
						artificial: true,
						groups: ["group3"],
						term: " ",
						sourceTerm: "United States",
					},
					{
						groups: ["group2", "group3", "group4"],
						term: "States",
						sourceTerm: "United States",
					},
				],
			},
			{
				term: "United Nations",
				groups: ["group1"],
				subTerms: [
					{
						groups: ["group1", "group4"],
						term: "United",
					},
					{
						artificial: true,
						groups: ["group1"],
						term: " ",
						sourceTerm: "United Nations",
					},
					{
						groups: ["group1", "group4"],
						term: "Nations",
					},
				],
			},
			{
				term: "Gamers United",
				groups: ["group1"],
				subTerms: [
					{
						groups: ["group1", "group4"],
						term: "Gamers",
					},
					{
						artificial: true,
						groups: ["group1"],
						term: " ",
						sourceTerm: "Gamers United",
					},
					{
						groups: ["group1", "group4"],
						term: "United",
					},
				],
			},
			{
				term: "United States",
				groups: ["group3"],
				subTerms: [
					{
						term: "United",
						groups: ["group3", "group4"],
					},
					{
						term: " ",
						artificial: true,
						groups: ["group3"],
						sourceTerm: "United States",
					},
					{
						term: "States",
						groups: ["group3", "group2", "group4"],
					},
				],
			},
			{
				groups: ["group4"],
				term: "Nations",
			},
			{
				groups: ["group2", "group4"],
				term: "States",
			},
			{
				groups: ["group4"],
				term: "United",
			},
			{
				groups: ["group4"],
				term: "Gamers",
			},
		]);
	});

	it("should handle empty input correctly", () => {
		const termByGroup = {};

		const terms = computeEnrichedTerms(termByGroup);
		expect(terms).toEqual([]);
	});
});
