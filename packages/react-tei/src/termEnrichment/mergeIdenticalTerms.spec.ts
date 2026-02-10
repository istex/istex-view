import { describe, expect, it } from "vitest";
import { mergeIdenticalTerms } from "./mergeIdenticalTerms";

describe("mergeIdenticalTerms", () => {
	it('should merge identical terms from different groups (e.g., "cat" from group1 and group2)', () => {
		const terms = [
			{ term: "cat", group: "group1" },
			{ term: "cat", group: "group2" },
		];
		const mergedTerms = mergeIdenticalTerms(terms);
		expect(mergedTerms).toEqual([
			{ targetText: "cat", groups: ["group1", "group2"] },
		]);
	});

	it("should not merge different terms", () => {
		const terms = [
			{ term: "cat", group: "group1" },
			{ term: "dog", group: "group2" },
		];
		const mergedTerms = mergeIdenticalTerms(terms);
		expect(mergedTerms).toEqual([
			{ targetText: "cat", groups: ["group1"] },
			{ targetText: "dog", groups: ["group2"] },
		]);
	});

	it("should handle multiple identical terms across various groups", () => {
		const terms = [
			{ term: "apple", group: "group1" },
			{ term: "banana", group: "group2" },
			{ term: "apple", group: "group3" },
			{ term: "orange", group: "group1" },
			{ term: "banana", group: "group1" },
		];
		const mergedTerms = mergeIdenticalTerms(terms);
		expect(mergedTerms).toEqual([
			{ targetText: "apple", groups: ["group1", "group3"] },

			{ targetText: "banana", groups: ["group2", "group1"] },
			{ targetText: "orange", groups: ["group1"] },
		]);
	});

	it("should handle terms with a single item", () => {
		const terms = [{ term: "single", group: "group1" }];
		const mergedTerms = mergeIdenticalTerms(terms);

		expect(mergedTerms).toEqual([{ targetText: "single", groups: ["group1"] }]);
	});

	it("should return an empty array when given an empty array", () => {
		const terms: { term: string; group: string }[] = [];
		const mergedTerms = mergeIdenticalTerms(terms);
		expect(mergedTerms).toEqual([]);
	});
});
