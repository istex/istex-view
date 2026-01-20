import { describe, expect, it } from "vitest";
import { areGroupsEqual } from "./areGroupsEqual";

describe("areGroupsEqual", () => {
	it("should return true for equal groups", () => {
		expect(areGroupsEqual(["a", "b", "c"], ["c", "b", "a"])).toBe(true);
	});

	it("should return false for different groups", () => {
		expect(areGroupsEqual(["a", "b"], ["a", "b", "c"])).toBe(false);
	});
});
