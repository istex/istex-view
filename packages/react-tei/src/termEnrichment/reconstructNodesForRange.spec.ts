import { describe, expect, it } from "vitest";
import { extractTextWithPositions } from "./extractTextWithPositions";
import {
	cloneNodeAtPath,
	mergeAdjacentStructures,
	reconstructNodesForRange,
} from "./reconstructNodesForRange";

describe("cloneNodeAtPath", () => {
	it("should return the node itself when path is empty", () => {
		const node = { tag: "hi", value: [{ tag: "#text", value: "Hello" }] };

		const result = cloneNodeAtPath(node, []);

		expect(result).toBe(node);
	});

	it("should return the node itself when it is a text node", () => {
		const node = { tag: "#text", value: "Hello" };

		const result = cloneNodeAtPath(node, [0]);

		expect(result).toBe(node);
	});

	it("should clone a node following a path to a child", () => {
		const node = {
			tag: "hi",
			value: [
				{ tag: "#text", value: "Hello" },
				{ tag: "#text", value: " World" },
			],
		};

		const result = cloneNodeAtPath(node, [0]);

		expect(result).toEqual({
			tag: "hi",
			value: [{ tag: "#text", value: "Hello" }],
		});
	});

	it("should clone deeply nested structures", () => {
		const node = {
			tag: "div",
			value: [
				{
					tag: "hi",
					value: [{ tag: "#text", value: "Deep" }],
				},
			],
		};

		const result = cloneNodeAtPath(node, [0, 0]);

		expect(result).toEqual({
			tag: "div",
			value: [
				{
					tag: "hi",
					value: [{ tag: "#text", value: "Deep" }],
				},
			],
		});
	});

	it("should return the node when value is not an array", () => {
		const node = { tag: "#text", value: "Hello" };

		const result = cloneNodeAtPath(node, [0, 1]);

		expect(result).toBe(node);
	});

	it("should return the node when child index does not exist", () => {
		const node = { tag: "hi", value: [{ tag: "#text", value: "Hello" }] };

		const result = cloneNodeAtPath(node, [5]);

		expect(result).toBe(node);
	});
});

describe("mergeAdjacentStructures", () => {
	it("should return empty array for empty input", () => {
		const result = mergeAdjacentStructures([]);

		expect(result).toEqual([]);
	});

	it("should return single node unchanged", () => {
		const nodes = [{ tag: "#text", value: "Hello" }];

		const result = mergeAdjacentStructures(nodes);

		expect(result).toEqual([{ tag: "#text", value: "Hello" }]);
	});

	it("should merge adjacent text nodes", () => {
		const nodes = [
			{ tag: "#text", value: "Hello " },
			{ tag: "#text", value: "world" },
		];

		const result = mergeAdjacentStructures(nodes);

		expect(result).toEqual([{ tag: "#text", value: "Hello world" }]);
	});

	it("should not merge non-adjacent text nodes", () => {
		const nodes = [
			{ tag: "#text", value: "Hello " },
			{ tag: "hi", value: [{ tag: "#text", value: "beautiful" }] },
			{ tag: "#text", value: " world" },
		];

		const result = mergeAdjacentStructures(nodes);

		expect(result).toEqual([
			{ tag: "#text", value: "Hello " },
			{ tag: "hi", value: [{ tag: "#text", value: "beautiful" }] },
			{ tag: "#text", value: " world" },
		]);
	});

	it("should merge multiple consecutive text nodes", () => {
		const nodes = [
			{ tag: "#text", value: "One " },
			{ tag: "#text", value: "Two " },
			{ tag: "#text", value: "Three" },
		];

		const result = mergeAdjacentStructures(nodes);

		expect(result).toEqual([{ tag: "#text", value: "One Two Three" }]);
	});

	it("should not merge text nodes with non-string values", () => {
		const nodes = [
			{ tag: "#text", value: "Hello " },
			{ tag: "#text", value: ["array"] },
		];

		const result = mergeAdjacentStructures(nodes as any);

		expect(result).toHaveLength(2);
	});
});

describe("reconstructNodesForRange", () => {
	it("should return empty array when no positions span the range", () => {
		const children = [{ tag: "#text", value: "Hello" }];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 10, 15);

		expect(result).toEqual([]);
	});

	it("should extract a substring from a single text node", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 0, 5);

		expect(result).toEqual([{ tag: "#text", value: "Hello" }]);
	});

	it("should extract text from the middle of a text node", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 6, 11);

		expect(result).toEqual([{ tag: "#text", value: "world" }]);
	});

	it("should merge text from multiple adjacent text nodes", () => {
		const children = [
			{ tag: "#text", value: "Hello " },
			{ tag: "#text", value: "world" },
		];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 0, 11);

		expect(result).toEqual([{ tag: "#text", value: "Hello world" }]);
	});

	it("should preserve nested tag structure for full text extraction", () => {
		const children = [{ tag: "hi", value: [{ tag: "#text", value: "Hello" }] }];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 0, 5);

		expect(result).toEqual([
			{ tag: "hi", value: [{ tag: "#text", value: "Hello" }] },
		]);
	});

	it("should create partial structure for partial text extraction from nested tag", () => {
		const children = [
			{ tag: "hi", value: [{ tag: "#text", value: "Hello world" }] },
		];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 0, 5);

		expect(result).toEqual([
			{ tag: "hi", value: [{ tag: "#text", value: "Hello" }] },
		]);
	});

	it("should reconstruct nodes spanning multiple children with mixed tags", () => {
		const children = [
			{ tag: "#text", value: "Hello " },
			{ tag: "hi", value: [{ tag: "#text", value: "beautiful" }] },
			{ tag: "#text", value: " world" },
		];
		const { positions } = extractTextWithPositions(children);

		// Extract "beautiful world" (positions 6-21)
		const result = reconstructNodesForRange(children, positions, 6, 21);

		expect(result).toEqual([
			{ tag: "hi", value: [{ tag: "#text", value: "beautiful" }] },
			{ tag: "#text", value: " world" },
		]);
	});

	it("should handle cross-tag extraction preserving inner tags", () => {
		const children = [
			{ tag: "#text", value: "Prince " },
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
		];
		const { positions } = extractTextWithPositions(children);

		// Extract "Prince Charles" (positions 0-14)
		const result = reconstructNodesForRange(children, positions, 0, 14);

		expect(result).toEqual([
			{ tag: "#text", value: "Prince " },
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
		]);
	});

	it("should handle partial extraction from nested tag at the start", () => {
		const children = [
			{ tag: "hi", value: [{ tag: "#text", value: "Gustave Eiffel" }] },
			{ tag: "#text", value: " was an architect" },
		];
		const { positions } = extractTextWithPositions(children);

		// Extract "Gustave" (positions 0-7)
		const result = reconstructNodesForRange(children, positions, 0, 7);

		expect(result).toEqual([
			{ tag: "hi", value: [{ tag: "#text", value: "Gustave" }] },
		]);
	});

	it("should handle deeply nested structures", () => {
		const children = [
			{
				tag: "div",
				value: [
					{
						tag: "hi",
						value: [{ tag: "#text", value: "Deep text" }],
					},
				],
			},
		];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 0, 4);

		expect(result).toEqual([
			{
				tag: "div",
				value: [
					{
						tag: "hi",
						value: [{ tag: "#text", value: "Deep" }],
					},
				],
			},
		]);
	});

	it("should skip empty slices", () => {
		const children = [
			{ tag: "#text", value: "Hello" },
			{ tag: "#text", value: "" },
			{ tag: "#text", value: " world" },
		];
		const { positions } = extractTextWithPositions(children);

		const result = reconstructNodesForRange(children, positions, 0, 11);

		expect(result).toEqual([{ tag: "#text", value: "Hello world" }]);
	});

	it("should handle extraction starting in the middle of first node", () => {
		const children = [
			{ tag: "#text", value: "Hello " },
			{ tag: "hi", value: [{ tag: "#text", value: "world" }] },
		];
		const { positions } = extractTextWithPositions(children);

		// Extract "lo world" (positions 3-11)
		const result = reconstructNodesForRange(children, positions, 3, 11);

		expect(result).toEqual([
			{ tag: "#text", value: "lo " },
			{ tag: "hi", value: [{ tag: "#text", value: "world" }] },
		]);
	});

	it("should handle extraction ending in the middle of last node", () => {
		const children = [
			{ tag: "#text", value: "Hello " },
			{ tag: "hi", value: [{ tag: "#text", value: "beautiful" }] },
		];
		const { positions } = extractTextWithPositions(children);

		// Extract "Hello beau" (positions 0-10)
		const result = reconstructNodesForRange(children, positions, 0, 10);

		expect(result).toEqual([
			{ tag: "#text", value: "Hello " },
			{ tag: "hi", value: [{ tag: "#text", value: "beau" }] },
		]);
	});
});
