import { describe, expect, it } from "vitest";
import {
	enrichDocumentWithTerms,
	getTermRegexes,
} from "./enrichDocumentWithTerm";

describe("enrichDocumentWithTerms", () => {
	it("replace all #text nodes with enriched nodes", () => {
		const document = {
			tag: "root",
			value: [
				{ tag: "#text", value: "This is a test." },
				{ tag: "p", value: [{ tag: "#text", value: "Another test here." }] },
			],
		};
		const unitexEnrichment = {
			group1: [{ term: "test", displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithTerms(
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
				{ term: "test", displayed: true },
				{
					term: "is",
					displayed: true,
				},
			],
			group2: [{ term: "Unitex", displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithTerms(
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
			group1: [{ term: "New York City", displayed: true }],
			group2: [{ term: "York", displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithTerms(
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
			group1: [{ term: "Prince Charles", displayed: true }],
			group2: [{ term: "Charles The Bold", displayed: true }],
			group3: [{ term: "The Bold Font", displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithTerms(
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

	it("should keep space between two different terms", () => {
		const document = {
			tag: "p",
			value: [{ tag: "#text", value: "Gustave Eiffel Marie Curie" }],
		};
		const unitexEnrichment = {
			group1: [{ term: "Gustave Eiffel", displayed: true }],
			group2: [{ term: "Marie Curie", displayed: true }],
		};

		const enrichedDocument = enrichDocumentWithTerms(
			document,
			unitexEnrichment,
		);

		expect(enrichedDocument).toEqual({
			tag: "p",
			value: [
				{
					attributes: undefined,
					tag: "highlightedText",
					value: [
						{
							attributes: {
								groups: ["group1"],
								term: "gustave-eiffel",
							},
							tag: "highlight",
							value: "Gustave Eiffel",
						},
						{
							tag: "#text",
							value: " ",
						},
						{
							attributes: {
								groups: ["group2"],
								term: "marie-curie",
							},
							tag: "highlight",
							value: "Marie Curie",
						},
					],
				},
			],
		});
	});

	describe("getTermRegexes", () => {
		it("should return regexes for terms with correct flags (case insensitive for teeft only)", () => {
			const terms = [
				{ term: "Unitex", groups: ["teeft"], subTerms: [] },
				{ term: "test", groups: ["other"], subTerms: [] },
			];

			const regexes = getTermRegexes(terms);

			expect(regexes).toEqual([
				{
					termRegex: /(?<![\p{L}\p{N}])Unitex(?![\p{L}\p{N}])/giu,
					term: "Unitex",
					groups: ["teeft"],
					value: "Unitex",
				},
				{
					termRegex: /(?<![\p{L}\p{N}])test(?![\p{L}\p{N}])/gu,
					term: "test",
					groups: ["other"],
					value: "test",
				},
			]);
		});

		it("should handle terms in with several groups including teeft", () => {
			const terms = [
				{ term: "Example", groups: ["teeft", "other"], subTerms: [] },
			];

			const regexes = getTermRegexes(terms);

			expect(regexes).toEqual([
				{
					termRegex: /(?<![\p{L}\p{N}])Example(?![\p{L}\p{N}])/giu,
					term: "Example",
					groups: ["teeft"],
					value: "Example",
				},
				{
					termRegex: /(?<![\p{L}\p{N}])Example(?![\p{L}\p{N}])/gu,
					term: "Example",
					groups: ["other"],
					value: "Example",
				},
			]);
		});

		it("should handle terms with subTerms", () => {
			const terms = [
				{
					term: "New York City",
					groups: ["place", "teeft"],
					subTerms: [
						{ term: "New", groups: ["place"] },
						{ term: "York", groups: ["place", "teeft"] },
						{ term: "City", groups: ["place"] },
					],
				},
			];

			const regexes = getTermRegexes(terms);

			expect(regexes).toEqual([
				{
					termRegex: /(?<![\p{L}\p{N}])New\sYork\sCity(?![\p{L}\p{N}])/giu,
					term: "New York City",
					groups: ["teeft"],
					value: [
						{
							tag: "highlight",
							value: [{ tag: "#text", value: "New" }],
							attributes: { groups: ["place"], term: "new" },
						},
						{
							tag: "highlight",
							value: [{ tag: "#text", value: "York" }],
							attributes: { groups: ["place", "teeft"], term: "york" },
						},
						{
							tag: "highlight",
							value: [{ tag: "#text", value: "City" }],
							attributes: { groups: ["place"], term: "city" },
						},
					],
				},
				{
					termRegex: /(?<![\p{L}\p{N}])New\sYork\sCity(?![\p{L}\p{N}])/gu,
					term: "New York City",
					groups: ["place"],
					value: [
						{
							tag: "highlight",
							value: [{ tag: "#text", value: "New" }],
							attributes: { groups: ["place"], term: "new" },
						},
						{
							tag: "highlight",
							value: [{ tag: "#text", value: "York" }],
							attributes: { groups: ["place", "teeft"], term: "york" },
						},
						{
							tag: "highlight",
							value: [{ tag: "#text", value: "City" }],
							attributes: { groups: ["place"], term: "city" },
						},
					],
				},
			]);
		});
	});
});
