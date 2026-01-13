import { describe, expect, it } from "vitest";
import {
	computeEnrichedTerms,
	enrichDocumentWithUnitex,
	getOverlappingTermsFromList,
	getTermOverlap,
	getWordOverlap,
	termToRegex,
} from "./enrichDocumentWithUnitex";

describe("enrichDocumentWithUnitex", () => {
	describe("termToRegex", () => {
		it.each([
			{ term: "test", text: "this is a test", expected: true },
			{ term: "test", text: "testing", expected: false },
			{ term: "test", text: "a test!", expected: true },
			{ term: "test", text: "pretest posttest", expected: false },
			{ term: "café", text: "I love café culture", expected: true },
			{ term: "cafe", text: "I love café culture", expected: false },
			{ term: "café", text: "I love cafe culture", expected: false },
			{ term: "café", text: "caféteria", expected: false },
			{ term: "naïve", text: "a naïve approach", expected: true },
			{ term: "naïve", text: "naïveté is common", expected: false },
			{ term: "The", text: "The quick brown fox", expected: true },
			{ term: "The", text: "devil the is in the details", expected: false },
			{ term: "the", text: "rather", expected: false },
			{ term: "1945", text: "In 1945, the war ended.", expected: true },
			{ term: "1945", text: "71945", expected: false },
			{ term: "1945", text: "19457", expected: false },
			{ term: "1945", text: "819457", expected: false },
			{
				term: "1945",
				text: "At the end of the war (1945) it happened",
				expected: true,
			},
			{
				term: "dev@marmelab.com",
				text: "Contact : dev@marmelab.com",
				expected: true,
			},
			{
				term: "c",
				text: "Languages: c, JavaScript, Typescript...",
				expected: true,
			},
			{
				term: "1920, 1921",
				text: "Between 1920, 1921 and 1922, many events happened.",
				expected: true,
			},
		])("should return $expected when trying to match term: $term on text: $text", ({
			term,
			text,
			expected,
		}) => {
			const regex = termToRegex(term);
			expect(regex.test(text)).toBe(expected);
		});

		it("should match on every occurrence of a term in a text", () => {
			const term = "test";
			const text = "this is a test. Testing the test cases for a test!";
			const regex = termToRegex(term);
			const matches = Array.from(text.matchAll(regex));
			// matches item are not literal object, so we check their properties directly
			expect(matches).toHaveLength(3);
			expect(matches[0]?.[0]).toBe("test");
			expect(matches[0]?.index).toBe(10);
			expect(matches[1]?.[0]).toBe("test");
			expect(matches[1]?.index).toBe(28);
			expect(matches[2]?.[0]).toBe("test");
			expect(matches[2]?.index).toBe(45);
		});
	});

	describe("getWordOverlap", () => {
		it("should return true for terms that have words intersection (The ends of one is the start of another)", () => {
			const termA = "New York City";
			const termB = "York City University";

			expect(getWordOverlap(termA, termB)).toBe("York City");
		});
		it('should work with longer overlapping parts (e.g., "United States of America" and "States of America and Canada")', () => {
			const termA = "The Great United States of America";
			const termB = "States of America and Canada";

			expect(getWordOverlap(termA, termB)).toBe("States of America");
		});

		it("should return false when there is an intersection but it equal one of the terms", () => {
			const termA = "New York City";
			const termB = "City";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should return false for terms that do not share any common parts", () => {
			const termA = "San Francisco";
			const termB = "Los Angeles";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should return false for identical terms", () => {
			const termA = "Paris";
			const termB = "Paris";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it('should be case sensitive when checking for word intersection (e.g., "Apple" vs "apple")', () => {
			const termA = "Apple Pie";
			const termB = "red apple";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should return false for terms that have substrings that intersects but do not share whole words", () => {
			const termA = "concat";
			const termB = "catastrophic";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it('should take punctuation into account when checking for word intersection (e.g., "end." vs "end")', () => {
			const termA = "The end.";
			const termB = "end of the world";

			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it("should take punctuation into account when checking for word intersection", () => {
			const termA = "apple, banana";
			const termB = "banana, kiwi";

			expect(getWordOverlap(termA, termB)).toBe("banana");
		});

		it('should take parentheses into account when checking for word intersection (e.g., "word)" vs "word")', () => {
			expect(getWordOverlap("example (test)", "test case")).toBe(null);
			expect(getWordOverlap("example (test)", "(test) case")).toBe("(test)");
		});
		it("should take brackets into account when checking for word intersection", () => {
			expect(getWordOverlap("data [set]", "set theory")).toBe(null);
			expect(getWordOverlap("data [set]", "[set] theory")).toBe("[set]");
		});

		it('should find no overlap when overlapping part is not a full word" ', () => {
			const termA = "Charles Quint";
			const termB = "Quintessence";
			expect(getWordOverlap(termA, termB)).toBe(null);
		});

		it('should find no overlap when overlapping part is not a full word" (with accent)', () => {
			const termA = "écrire";
			const termB = "créé";
			expect(getWordOverlap(termA, termB)).toBe(null);
		});
	});

	describe("getTermOverlap", () => {
		it('should return overlapping term for "Prince Charles" and "Charles Xavier"', () => {
			const termA = {
				group: "group1",
				term: "Prince Charles",
				frequency: 1,
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "Charles Xavier",
				frequency: 1,
				displayed: true,
			};

			const overlappingTerms = getTermOverlap(termA, termB);

			expect(overlappingTerms).toEqual([
				{
					group: "group1",
					term: "Prince ",
				},
				{
					group: "group1+group2",
					hybrid: true,
					term: "Charles",
				},
				{
					group: "group2",
					term: " Xavier",
				},
			]);
		});

		it('should return overlapping term for "United States of America" and "States of America and Canada"', () => {
			const termA = {
				group: "group1",
				term: "United States of America",
				frequency: 1,
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "States of America and Canada",
				frequency: 1,
				displayed: true,
			};

			const overlappingTerms = getTermOverlap(termA, termB);

			expect(overlappingTerms).toEqual([
				{
					group: "group1",
					term: "United ",
				},
				{
					group: "group1+group2",
					hybrid: true,
					term: "States of America",
				},
				{
					group: "group2",
					term: " and Canada",
				},
			]);
		});

		it("should return the same result regardless of the order of terms", () => {
			const termA = {
				group: "group1",
				term: "New York City",
				frequency: 1,
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "York City University",
				frequency: 1,
				displayed: true,
			};
			const overlappingTermsAB = getTermOverlap(termA, termB);
			const overlappingTermsBA = getTermOverlap(termB, termA);
			expect(overlappingTermsAB).toEqual(overlappingTermsBA);
		});

		it("should return an empty array when there is no word overlap", () => {
			const termA = {
				group: "group1",
				term: "Charles Quint",
				frequency: 1,
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "Quintessence",
				frequency: 1,
				displayed: true,
			};
			const overlappingTerms = getTermOverlap(termA, termB);
			expect(overlappingTerms).toEqual([]);
		});

		it("should return an empty array when there is no word overlap (even with accented character)", () => {
			const termA = {
				group: "group1",
				term: "écrire",
				frequency: 1,
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "créé",
				frequency: 1,
				displayed: true,
			};
			const overlappingTerms = getTermOverlap(termA, termB);
			expect(overlappingTerms).toEqual([]);
		});

		it("should return an empty array when there is no word overlap", () => {
			const termA = {
				group: "group1",
				term: "San Francisco",
				frequency: 1,
				displayed: true,
			};
			const termB = {
				group: "group2",
				term: "Los Angeles",
				frequency: 1,
				displayed: true,
			};
			const overlappingTerms = getTermOverlap(termA, termB);
			expect(overlappingTerms).toEqual([]);
		});
	});

	describe("getOverlappingTermsFromList", () => {
		it("should find all overlapping terms in a list", () => {
			const terms = [
				{
					group: "group1",
					term: "Prince Charles",
					frequency: 1,
					displayed: true,
				},
				{
					group: "group1",
					term: "Charles Xavier",
					frequency: 1,
					displayed: true,
				},
				{ group: "group1", term: "Wolverine", frequency: 1, displayed: true },
				{
					group: "group1",
					term: "Charles the bold",
					frequency: 1,
					displayed: true,
				},
				{
					group: "group1",
					term: "Charles Quint",
				},
				{
					group: "group2",
					term: "bold font",
					frequency: 1,
					displayed: true,
				},
				{
					group: "group2",
					term: "Quintessence",
					frequency: 1,
					displayed: true,
				},
			];
			const overlappingTerms = getOverlappingTermsFromList(terms);

			expect(overlappingTerms).toEqual([
				{
					displayed: true,
					frequency: 1,
					group: "group1",
					term: "Prince Charles",
				},
				{
					group: "group1",
					term: "Prince ",
				},
				{
					group: "group1+group1",
					hybrid: true,
					term: "Charles",
				},
				{
					group: "group1",
					term: " Xavier",
				},
				{
					group: "group1",
					term: "Prince ",
				},
				{
					group: "group1+group1",
					hybrid: true,
					term: "Charles",
				},
				{
					group: "group1",
					term: " the bold",
				},
				{
					group: "group1",
					term: "Prince ",
				},
				{
					group: "group1+group1",
					hybrid: true,
					term: "Charles",
				},
				{
					group: "group1",
					term: " Quint",
				},
				{
					displayed: true,
					frequency: 1,
					group: "group1",
					term: "Charles the bold",
				},
				{
					group: "group1",
					term: "Charles the ",
				},
				{
					group: "group1+group2",
					hybrid: true,
					term: "bold",
				},
				{
					group: "group2",
					term: " font",
				},
			]);
		});
	});

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
							term: "cat",
							groups: ["group2"],
						},
						{
							term: "France",
							groups: ["group3"],
						},
					],
				},
				{
					term: "cat",
					groups: ["group2", "group3"],
				},
				{
					term: "dog",
					groups: ["group2"],
				},
				{
					term: "France",
					groups: ["group3"],
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
							term: "York",
							groups: ["group2"],
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
					term: "concat",
					groups: ["group1"],
				},
				{
					term: "catastrophic",
					groups: ["group2"],
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
							groups: ["group2"],
						},
						{
							term: "Bay Area",
							groups: ["group3"],
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
							term: "Saucisson",
							groups: ["group2", "group3"],
						},
						{
							term: "sec",
							groups: ["group2"],
						},
					],
				},
				{
					term: "saucisson sec",
					groups: ["group2"],
					subTerms: [
						{
							term: "saucisson",
							groups: ["group3"],
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
				{ term: "cat lover", groups: ["group1"], subTerms: [] },
				{ term: "cat", groups: ["group1"], subTerms: [] },
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

		it('should handle overlapping terms correctly (e.g., "Prince Charles" and "Charles Xavier")', () => {
			const termByGroup = {
				group1: [{ term: "Prince Charles", frequency: 1, displayed: true }],
				group2: [{ term: "Charles Xavier", frequency: 1, displayed: true }],
			};

			const terms = computeEnrichedTerms(termByGroup);

			expect(terms).toEqual([
				{
					term: "Prince Charles Xavier",
					groups: ["group1", "group2"],
					artificial: true,
					subTerms: [
						{
							term: "Prince Charles",
							groups: ["group1"],
						},
						{
							term: "Charles Xavier",
							groups: ["group2"],
						},
					],
				},
				{
					term: "Prince Charles",
					groups: ["group1"],
				},
				{
					term: "Charles Xavier",
					groups: ["group2"],
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
					groups: ["group1"],
					artificial: true,
					subTerms: [
						{
							term: "Prince Charles",
							groups: ["group1"],
						},
						{
							term: "Charles Xavier",
							groups: ["group1"],
						},
					],
				},
				{
					term: "Prince Charles",
					groups: ["group1"],
				},
				{
					term: "Charles Xavier",
					groups: ["group1"],
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
					groups: ["group1"],
					artificial: true,
					subTerms: [
						{
							term: "Gamers",
							groups: ["group4"],
						},
						{
							term: "United",
							groups: ["group4"],
						},
						{
							term: "Nations",
							groups: ["group4"],
						},
					],
				},
				{
					term: "Gamers United States",
					groups: ["group1", "group3"],
					artificial: true,
					subTerms: [
						{
							term: "Gamers",
							groups: ["group4"],
						},
						{
							term: "United",
							groups: ["group4"],
						},
						{
							term: "States",
							groups: ["group2", "group4"],
						},
					],
				},
				{
					term: "United Nations",
					groups: ["group1"],
					subTerms: [
						{
							term: "United",
							groups: ["group4"],
						},
						{
							term: "Nations",
							groups: ["group4"],
						},
					],
				},
				{
					term: "Gamers United",
					groups: ["group1"],
					subTerms: [
						{
							term: "Gamers",
							groups: ["group4"],
						},
						{
							term: "United",
							groups: ["group4"],
						},
					],
				},
				{
					term: "United States",
					groups: ["group3"],
					subTerms: [
						{
							term: "United",
							groups: ["group4"],
						},
						{
							term: "States",
							groups: ["group2", "group4"],
						},
					],
				},
				{
					term: "Nations",
					groups: ["group4"],
				},
				{
					term: "States",
					groups: ["group2", "group4"],
				},
				{
					term: "United",
					groups: ["group4"],
				},
				{
					term: "Gamers",
					groups: ["group4"],
				},
			]);
		});

		it("should handle empty input correctly", () => {
			const termByGroup = {};

			const terms = computeEnrichedTerms(termByGroup);

			expect(terms).toEqual([]);
		});
	});

	// TODO: update test once enrichDocumentWithUnitex is implemented
	it.skip("replace all #text nodes with enriched nodes", () => {
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
							value: [
								{
									tag: "#text",
									value: "test",
								},
							],
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
									value: [
										{
											tag: "#text",
											value: "test",
										},
									],
								},
								{ tag: "#text", value: " here." },
							],
						},
					],
				},
			],
		});
	});

	// TODO: update test once enrichDocumentWithUnitex is implemented
	it.skip("replace several terms from different groups in #text nodes", () => {
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
							value: [
								{
									tag: "#text",
									value: "is",
								},
							],
						},
						{ tag: "#text", value: " a " },
						{
							tag: "highlight",
							attributes: { groups: ["group1"], term: "test" },
							value: [
								{
									tag: "#text",
									value: "test",
								},
							],
						},
						{ tag: "#text", value: " of " },
						{
							tag: "highlight",
							attributes: { groups: ["group2"], term: "unitex" },
							value: [
								{
									tag: "#text",
									value: "Unitex",
								},
							],
						},
						{ tag: "#text", value: " highlighting." },
					],
				},
			],
		});
	});
});
