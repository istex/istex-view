import { describe, expect, it, vi } from "vitest";
import { DateTag } from "./DateTag";

describe("DateTag", () => {
	it("should return the @when attribute if present", () => {
		const data = { tag: "date", attributes: { "@when": "2023-10-05" } };
		const result = DateTag({ data });
		expect(result).toBe("2023-10-05");
	});

	it("should return null and log a warning if @when attribute is missing", () => {
		const data = { tag: "date", attributes: {} };
		console.warn = vi.fn();
		const result = DateTag({ data });
		expect(result).toBeNull();
		expect(console.warn).toHaveBeenCalledWith(
			"Date tag missing @when attribute:",
			data,
		);
	});
	it("should return null and log a warning if attributes are missing", () => {
		const data = { tag: "date" };
		console.warn = vi.fn();
		const result = DateTag({ data });
		expect(result).toBeNull();
		expect(console.warn).toHaveBeenCalledWith(
			"Date tag missing @when attribute:",
			data,
		);
	});
});
