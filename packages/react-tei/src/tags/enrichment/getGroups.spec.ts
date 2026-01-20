import { describe, expect, it } from "vitest";
import { getGroups } from "./getGroups";

describe("getGroups", () => {
	it("should renturn an empty array when groups is undefined", () => {
		expect(getGroups(undefined)).toStrictEqual([]);
	});

	it.each<{ groups: string; expectedGroups: string[] }>([
		{ groups: "persName", expectedGroups: ["persName"] },
		{ groups: "persName placeName", expectedGroups: ["persName", "placeName"] },
	])("should return an array of groups split by space when groups is a string", ({
		groups,
		expectedGroups,
	}) => {
		expect(getGroups(groups)).toStrictEqual(expectedGroups);
	});

	it.each<{ groups: string[] }>([
		{ groups: ["persName"] },
		{
			groups: ["persName", "placeName"],
		},
	])("should return the same array when groups is already an array", ({
		groups,
	}) => {
		expect(getGroups(groups)).toStrictEqual(groups);
	});
});
