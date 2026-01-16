import { describe, expect, it } from "vitest";
import { findTermPosition } from "./findTermPosition";

describe("findTermPosition", () => {
	it("finds term at the beginning of the container", () => {
		const container = "test is a term";
		const term = "test";
		const position = findTermPosition(container, term);
		expect(position).toEqual({ start: 0, end: 4 });
	});

	it("finds term at the end of the container", () => {
		const container = "this is a test";
		const term = "test";
		const position = findTermPosition(container, term);
		expect(position).toEqual({ start: 10, end: 14 });
	});

	it("finds term in the middle of the container", () => {
		const container = "this is a test term";
		const term = "test";
		const position = findTermPosition(container, term);
		expect(position).toEqual({ start: 10, end: 14 });
	});

	it("returns null when term is not found", () => {
		const container = "this is a sample";
		const term = "test";
		const position = findTermPosition(container, term);
		expect(position).toBeNull();
	});

	it("respects word boundaries", () => {
		const container = "testing the term";
		const term = "test";
		const position = findTermPosition(container, term);
		expect(position).toBeNull();
	});

	it("finds term with special regex characters", () => {
		const container = "this is a test.term!";
		const term = "test.term!";
		const position = findTermPosition(container, term);
		expect(position).toEqual({ start: 10, end: 20 });
	});
});
