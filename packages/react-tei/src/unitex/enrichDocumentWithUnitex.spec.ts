import { describe, expect, it } from "vitest";
import {
	computeEnrichedTerms,
	enrichDocumentWithUnitex,
} from "./enrichDocumentWithUnitex";

describe("enrichDocumentWithUnitex", () => {
	describe("computeEnrichedTerms", () => {
		it('should regroup identical terms from different groups (e.g., "cat" from group1 and group2)', () => {
			const termByGroup = {
				group1: [{ term: "cat", frequency: 1, displayed: true }],
				group2: [{ term: "cat", frequency: 1, displayed: true }],
			};

			const terms = computeEnrichedTerms(termByGroup);

			expect(terms).toEqual([{ term: "cat", groups: ["group1", "group2"] }]);
		});

		it("should compute enriched terms with regrouped identical terms and nested contained terms", () => {
			const termByGroup = {
				group1: [
					{
						term: "France Organization of cat lover",
						frequency: 1,
						displayed: true,
					},
				],
				group2: [
					{ term: "cat", frequency: 1, displayed: true },
					{ term: "dog", frequency: 1, displayed: true },
				],
				group3: [
					{ term: "France", frequency: 1, displayed: true },
					{ term: "cat", frequency: 1, displayed: true },
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
				group1: [{ term: "New York City", frequency: 1, displayed: true }],
				group2: [{ term: "York", frequency: 1, displayed: true }],
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
				group1: [{ term: "overconfident", frequency: 1, displayed: true }],
				group2: [{ term: "conf", frequency: 1, displayed: true }],
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
				group1: [{ term: "concat", frequency: 1, displayed: true }],
				group2: [{ term: "catastrophic", frequency: 1, displayed: true }],
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
				group1: [
					{ term: "San Francisco Bay Area", frequency: 1, displayed: true },
				],
				group2: [{ term: "San Francisco", frequency: 1, displayed: true }],
				group3: [{ term: "Bay Area", frequency: 1, displayed: true }],
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
						frequency: 1,
						displayed: true,
					},
				],
				group2: [{ term: "saucisson sec", frequency: 1, displayed: true }],
				group3: [{ term: "saucisson", frequency: 1, displayed: true }],
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
					{ term: "cat lover", frequency: 1, displayed: true },
					{ term: "cat", frequency: 1, displayed: true },
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
					{ term: "United States of America", frequency: 1, displayed: true },
					{ term: "America", frequency: 1, displayed: true },
				],
				group2: [{ term: "America", frequency: 1, displayed: true }],
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
					{ term: "Prince Charles", frequency: 1, displayed: true },
					{ term: "Charles Xavier", frequency: 1, displayed: true },
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
				group1: [{ term: "Prince Charles", frequency: 1, displayed: true }],
				group2: [{ term: "Charles The Bold", frequency: 1, displayed: true }],
				group3: [{ term: "The Bold Font", frequency: 1, displayed: true }],
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
					{ term: "United Nations", frequency: 1, displayed: true },
					{ term: "Gamers United", frequency: 1, displayed: true },
				],
				group3: [{ term: "United States", frequency: 1, displayed: true }],
				group2: [{ term: "States", frequency: 1, displayed: true }],
				group4: [
					{ term: "United", frequency: 1, displayed: true },
					{ term: "States", frequency: 1, displayed: true },
					{ term: "Nations", frequency: 1, displayed: true },
					{ term: "Gamers", frequency: 1, displayed: true },
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

	it("replace all #text nodes with enriched nodes", () => {
		const document = {
			tag: "root",
			value: [
				{ tag: "#text", value: "This is a test." },
				{ tag: "p", value: [{ tag: "#text", value: "Another test here." }] },
			],
		};
		const unitexEnrichment = {
			group1: [{ term: "test", frequency: 2, displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithUnitex(
			document,
			unitexEnrichment,
		);

		expect(enrichedDocument).toEqual({
			tag: "root",
			value: [
				{
					tag: "highlightedText",
					value: [
						{ tag: "#text", value: "This is a " },
						{
							tag: "highlight",
							attributes: { groups: ["group1"], term: "test" },
							value: "test",
						},
						{ tag: "#text", value: "." },
					],
				},
				{
					tag: "p",
					value: [
						{
							tag: "highlightedText",
							value: [
								{ tag: "#text", value: "Another " },
								{
									tag: "highlight",
									attributes: { groups: ["group1"], term: "test" },
									value: "test",
								},
								{ tag: "#text", value: " here." },
							],
						},
					],
				},
			],
		});
	});

	it("replace several terms from different groups in #text nodes", () => {
		const document = {
			tag: "root",
			value: [
				{ tag: "#text", value: "This is a test of Unitex highlighting." },
			],
		};
		const unitexEnrichment = {
			group1: [
				{ term: "test", frequency: 1, displayed: true },
				{
					term: "is",
					frequency: 1,
					displayed: true,
				},
			],
			group2: [{ term: "Unitex", frequency: 1, displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithUnitex(
			document,
			unitexEnrichment,
		);

		expect(enrichedDocument).toEqual({
			tag: "root",
			value: [
				{
					tag: "highlightedText",
					value: [
						{ tag: "#text", value: "This " },
						{
							tag: "highlight",
							attributes: { groups: ["group1"], term: "is" },
							value: "is",
						},
						{ tag: "#text", value: " a " },
						{
							tag: "highlight",
							attributes: { groups: ["group1"], term: "test" },
							value: "test",
						},
						{ tag: "#text", value: " of " },
						{
							tag: "highlight",
							attributes: { groups: ["group2"], term: "unitex" },
							value: "Unitex",
						},
						{ tag: "#text", value: " highlighting." },
					],
				},
			],
		});
	});

	it('replace terms containing nested terms (e.g., "New York City" containing "York")', () => {
		const document = {
			tag: "root",
			value: [{ tag: "#text", value: "Welcome to New York City!" }],
		};
		const unitexEnrichment = {
			group1: [{ term: "New York City", frequency: 1, displayed: true }],
			group2: [{ term: "York", frequency: 1, displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithUnitex(
			document,
			unitexEnrichment,
		);

		expect(enrichedDocument).toEqual({
			tag: "root",
			value: [
				{
					attributes: undefined,
					tag: "highlightedText",
					value: [
						{
							tag: "#text",
							value: "Welcome to ",
						},
						{
							attributes: {
								groups: ["group1"],
								term: "new-york-city",
							},
							tag: "highlight",
							value: [
								{
									attributes: {
										groups: ["group1"],
										term: "new-york-city",
									},
									tag: "highlight",
									value: [
										{
											tag: "#text",
											value: "New ",
										},
									],
								},
								{
									attributes: {
										groups: ["group1", "group2"],
										term: "york",
									},
									tag: "highlight",
									value: [
										{
											tag: "#text",
											value: "York",
										},
									],
								},
								{
									attributes: {
										groups: ["group1"],
										term: "new-york-city",
									},
									tag: "highlight",
									value: [
										{
											tag: "#text",
											value: " City",
										},
									],
								},
							],
						},
						{
							tag: "#text",
							value: "!",
						},
					],
				},
			],
		});
	});

	it("should replace term overlapping another term that overlap a third one", () => {
		const document = {
			tag: "root",
			value: [{ tag: "#text", value: "Prince Charles The Bold Font" }],
		};
		const unitexEnrichment = {
			group1: [{ term: "Prince Charles", frequency: 1, displayed: true }],
			group2: [{ term: "Charles The Bold", frequency: 1, displayed: true }],
			group3: [{ term: "The Bold Font", frequency: 1, displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithUnitex(
			document,
			unitexEnrichment,
		);

		expect(enrichedDocument).toEqual({
			tag: "root",
			value: [
				{
					attributes: undefined,
					tag: "highlightedText",
					value: [
						{
							attributes: {
								groups: ["group1+group2+group3"],
								term: "prince-charles-the-bold-font",
							},
							tag: "highlight",
							value: [
								{
									tag: "highlight",
									value: [{ tag: "#text", value: "Prince " }],
									attributes: {
										groups: ["group1"],
										term: "prince-charles",
									},
								},
								{
									tag: "highlight",
									value: [{ tag: "#text", value: "Charles" }],
									attributes: {
										groups: ["group1", "group2"],
										term: null,
									},
								},
								{
									tag: "highlight",
									value: [
										{
											tag: "#text",
											value: " ",
										},
									],
									attributes: {
										groups: ["group2"],
										term: "charles-the-bold",
									},
								},
								{
									tag: "highlight",
									value: [{ tag: "#text", value: "The Bold" }],
									attributes: {
										groups: ["group2", "group3"],
										term: null,
									},
								},
								{
									tag: "highlight",
									value: [{ tag: "#text", value: " Font" }],
									attributes: {
										groups: ["group3"],
										term: "the-bold-font",
									},
								},
							],
						},
					],
				},
			],
		});
	});
});
