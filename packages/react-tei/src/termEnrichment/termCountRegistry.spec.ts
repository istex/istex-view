import { describe, expect, it } from "vitest";
import {
	deduplicateTerms,
	extractTermsWithGroups,
	incrementIfExists,
	incrementTermCountInRegistry,
	type TermCountByGroup,
	type TermWithGroups,
} from "./termCountRegistry";
import type { HighlightTag } from "./types";

describe("extractTermsWithGroups", () => {
	it("should extract term from a string value", () => {
		const result = extractTermsWithGroups("Hello World", ["group1"]);

		expect(result).toEqual([{ term: "hello-world", groups: ["group1"] }]);
	});

	it("should extract term from a string with multiple groups", () => {
		const result = extractTermsWithGroups("Test Term", ["group1", "group2"]);

		expect(result).toEqual([
			{ term: "test-term", groups: ["group1", "group2"] },
		]);
	});

	it("should extract terms from highlight tags", () => {
		const term = [
			{
				tag: "highlight" as const,
				attributes: {
					groups: ["persName"],
					term: "marie-curie",
				} as HighlightTag["attributes"],
				value: [{ tag: "#text" as const, value: "Marie Curie" }],
			},
		];

		const result = extractTermsWithGroups(term, ["defaultGroup"]);

		expect(result).toEqual([{ term: "marie-curie", groups: ["persName"] }]);
	});

	it("should extract terms from text tags with kebab-case conversion", () => {
		const term = [{ tag: "#text" as const, value: "Some Text Value" }];

		const result = extractTermsWithGroups(term, ["group1"]);

		expect(result).toEqual([{ term: "some-text-value", groups: ["group1"] }]);
	});

	it("should extract terms from mixed highlight and text tags", () => {
		const term = [
			{
				tag: "highlight" as const,
				attributes: {
					groups: ["orgName"],
					term: "university",
				} as HighlightTag["attributes"],
				value: [{ tag: "#text" as const, value: "University" }],
			},
			{ tag: "#text" as const, value: "Some Text" },
		];

		const result = extractTermsWithGroups(term, ["defaultGroup"]);

		expect(result).toEqual([
			{ term: "university", groups: ["orgName"] },
			{ term: "some-text", groups: ["defaultGroup"] },
		]);
	});

	it("should handle empty array", () => {
		const result = extractTermsWithGroups([], ["group1"]);

		expect(result).toEqual([]);
	});
});

describe("deduplicateTerms", () => {
	it("should return empty array for empty input", () => {
		const result = deduplicateTerms([]);

		expect(result).toEqual([]);
	});

	it("should keep unique terms", () => {
		const terms: TermWithGroups[] = [
			{ term: "term1", groups: ["group1"] },
			{ term: "term2", groups: ["group2"] },
		];

		const result = deduplicateTerms(terms);

		expect(result).toEqual(terms);
	});

	it("should remove duplicate term/groups combinations", () => {
		const terms: TermWithGroups[] = [
			{ term: "term1", groups: ["group1"] },
			{ term: "term1", groups: ["group1"] },
			{ term: "term2", groups: ["group2"] },
		];

		const result = deduplicateTerms(terms);

		expect(result).toEqual([
			{ term: "term1", groups: ["group1"] },
			{ term: "term2", groups: ["group2"] },
		]);
	});

	it("should keep terms with same name but different groups", () => {
		const terms: TermWithGroups[] = [
			{ term: "term1", groups: ["group1"] },
			{ term: "term1", groups: ["group2"] },
		];

		const result = deduplicateTerms(terms);

		expect(result).toEqual(terms);
	});

	it("should keep terms with same groups but different names", () => {
		const terms: TermWithGroups[] = [
			{ term: "term1", groups: ["group1", "group2"] },
			{ term: "term2", groups: ["group1", "group2"] },
		];

		const result = deduplicateTerms(terms);

		expect(result).toEqual(terms);
	});

	it("should consider group order when deduplicating", () => {
		const terms: TermWithGroups[] = [
			{ term: "term1", groups: ["group1", "group2"] },
			{ term: "term1", groups: ["group2", "group1"] },
		];

		const result = deduplicateTerms(terms);

		// Different group order means different key, so both should be kept
		expect(result).toHaveLength(2);
	});
});

describe("incrementIfExists", () => {
	it("should return new registry with incremented count when term exists", () => {
		const registry: TermCountByGroup = {
			group1: { term1: 0 },
		};

		const result = incrementIfExists(registry, "group1", "term1");

		expect(result.group1!.term1).toBe(1);
		expect(registry.group1!.term1).toBe(0); // Original unchanged
	});

	it("should return same registry when group does not exist", () => {
		const registry: TermCountByGroup = {
			group1: { term1: 0 },
		};

		const result = incrementIfExists(registry, "nonexistent", "term1");

		expect(result).toBe(registry); // Same reference
	});

	it("should return same registry when term does not exist in group", () => {
		const registry: TermCountByGroup = {
			group1: { term1: 0 },
		};

		const result = incrementIfExists(registry, "group1", "nonexistent");

		expect(result).toBe(registry); // Same reference
	});

	it("should increment from existing count", () => {
		const registry: TermCountByGroup = {
			group1: { term1: 5 },
		};

		const result = incrementIfExists(registry, "group1", "term1");

		expect(result.group1!.term1).toBe(6);
	});

	it("should only affect the specified group and term", () => {
		const registry: TermCountByGroup = {
			group1: { term1: 0, term2: 0 },
			group2: { term1: 0 },
		};

		const result = incrementIfExists(registry, "group1", "term1");

		expect(result).toEqual({
			group1: { term1: 1, term2: 0 },
			group2: { term1: 0 },
		});
	});
});

describe("incrementTermCountInRegistry", () => {
	it("should return new registry with incremented count of a term", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"université-gustave-eiffel": 0,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		const result = incrementTermCountInRegistry(
			registry,
			"orgName",
			"Université Gustave Eiffel",
		);

		expect(result).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 1,
			},
			persName: {
				"université-gustave-eiffel": 0,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		});
		expect(registry.orgName!["université-gustave-eiffel"]).toBe(0); // Original unchanged
	});

	it("should increment value in multiple groups separated by a plus sign", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"université-gustave-eiffel": 0,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		const result = incrementTermCountInRegistry(
			registry,
			"orgName+persName",
			"Université Gustave Eiffel",
		);

		expect(result).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 1,
			},
			persName: {
				"université-gustave-eiffel": 1,
				"eiffel-g.": 0,
				"gustave-eiffel": 0,
				"marie-curie": 0,
			},
			teeft: {},
		});
	});

	it("should update counts for terms represented as highlights", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		const highlightTag = [
			{
				tag: "highlight",
				attributes: {
					groups: ["persName"],
					term: "eiffel-g.",
				},
				value: [
					{
						tag: "#text" as const,
						value: "Eiffel G.",
					},
				],
			},
		] as HighlightTag[];

		const result = incrementTermCountInRegistry(
			registry,
			"persName",
			highlightTag,
		);

		expect(result).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 1,
			},
			teeft: {},
		});
	});

	it("should handle terms in multiple highlight tags", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		const highlightTag = [
			{
				tag: "highlight",
				attributes: {
					groups: ["orgName"],
					term: "université-gustave-eiffel",
				},
				value: [
					{
						tag: "#text" as const,
						value: "Université Gustave Eiffel",
					},
				],
			},
			{
				tag: "highlight",
				attributes: {
					groups: ["persName"],
					term: "eiffel-g.",
				},
				value: [
					{
						tag: "#text" as const,
						value: "Eiffel G.",
					},
				],
			},
		] as HighlightTag[];

		const result = incrementTermCountInRegistry(
			registry,
			"orgName+persName",
			highlightTag,
		);

		expect(result).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 1,
			},
			persName: {
				"eiffel-g.": 1,
			},
			teeft: {},
		});
	});

	it("should handle terms as text tags", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 0,
			},
			teeft: {},
		} as TermCountByGroup;

		const result = incrementTermCountInRegistry(registry, "persName", [
			{
				tag: "#text" as const,
				value: "Eiffel G.",
			},
		]);

		expect(result).toStrictEqual({
			orgName: {
				"université-gustave-eiffel": 0,
			},
			persName: {
				"eiffel-g.": 1,
			},
			teeft: {},
		});
	});

	it("should return unchanged registry for terms not present", () => {
		const registry = {
			orgName: {
				"université-gustave-eiffel": 2,
			},
			persName: {
				"eiffel-g.": 3,
			},
			teeft: {},
		} as TermCountByGroup;

		const result = incrementTermCountInRegistry(
			registry,
			"orgName",
			"Nonexistent Organization",
		);

		expect(result).toBe(registry); // Same reference when no changes
	});

	it("should return same registry when term is null or undefined", () => {
		const registry = {
			orgName: { term1: 0 },
		} as TermCountByGroup;

		const result = incrementTermCountInRegistry(registry, "orgName", null);

		expect(result).toBe(registry);
	});
});
