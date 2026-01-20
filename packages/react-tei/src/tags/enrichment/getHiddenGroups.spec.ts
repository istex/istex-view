import { describe, expect, it } from "vitest";
import type { JsonTermEnrichment } from "../../DocumentContextProvider";
import { getHiddenGroups } from "./getHiddenGroups";

describe("getHiddenGroups", () => {
	it.each<JsonTermEnrichment>([
		{
			persName: [{ term: "Einstein", displayed: true }],
			placeName: [{ term: "London", displayed: false }],
		},
		{
			persName: [{ term: "einstein", displayed: true }],
			placeName: [{ term: "london", displayed: false }],
		},
	])("should not return groups whith term displayed", (terms) => {
		expect(
			getHiddenGroups({
				enrichmentGroups: terms,
				term: "einstein",
				groups: ["persName"],
			}),
		).toStrictEqual([]);
	});

	it.each<JsonTermEnrichment>([
		{
			persName: [{ term: "Einstein", displayed: true }],
			placeName: [{ term: "London", displayed: false }],
		},
		{
			persName: [{ term: "einstein", displayed: true }],
			placeName: [{ term: "london", displayed: false }],
		},
	])('should not return groups that does not include the term"', (terms) => {
		expect(
			getHiddenGroups({
				enrichmentGroups: terms,
				term: "einstein",
				groups: ["placeName"],
			}),
		).toStrictEqual([]);
	});

	it.each<JsonTermEnrichment>([
		{
			persName: [{ term: "Einstein", displayed: true }],
			placeName: [{ term: "London", displayed: false }],
		},
		{
			persName: [{ term: "einstein", displayed: true }],
			placeName: [{ term: "london", displayed: false }],
		},
	])('should return groups with the term and displayed as false"', (terms) => {
		expect(
			getHiddenGroups({
				enrichmentGroups: terms,
				term: "london",
				groups: ["placeName"],
			}),
		).toStrictEqual(["placeName"]);
	});

	it("should add parent hidden groups to the list of hidden groups", () => {
		expect(
			getHiddenGroups({
				enrichmentGroups: {
					persName: [
						{ term: "Einstein", displayed: true },
						{ term: "Newton", displayed: true },
					],
				},
				term: "newton",
				groups: ["placeName", "persName"],
				parentHiddenGroups: ["placeName"],
			}),
		).toStrictEqual(["placeName"]);
	});
});
