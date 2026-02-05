import { describe, expect, it } from "vitest";
import {
	extractTextWithPositions,
	findSpannedPositions,
	getSliceBoundaries,
} from "./extractTextWithPositions";

describe("extractTextWithPositions", () => {
	it("should extract text from a single text node", () => {
		const children = [{ tag: "#text", value: "Hello world" }];

		const result = extractTextWithPositions(children);

		expect(result.text).toBe("Hello world");
		expect(result.positions).toHaveLength(1);
		expect(result.positions[0]).toMatchObject({
			startInConcat: 0,
			endInConcat: 11,
			textStart: 0,
			textEnd: 11,
			path: [0],
		});
	});

	it("should concatenate text from multiple text nodes", () => {
		const children = [
			{ tag: "#text", value: "Hello " },
			{ tag: "#text", value: "world" },
		];

		const result = extractTextWithPositions(children);

		expect(result.text).toBe("Hello world");
		expect(result.positions).toHaveLength(2);
		expect(result.positions[0]).toMatchObject({
			startInConcat: 0,
			endInConcat: 6,
			path: [0],
		});
		expect(result.positions[1]).toMatchObject({
			startInConcat: 6,
			endInConcat: 11,
			path: [1],
		});
	});

	it("should extract text from nested elements", () => {
		const children = [
			{ tag: "#text", value: "Hello " },
			{
				tag: "hi",
				value: [{ tag: "#text", value: "beautiful" }],
			},
			{ tag: "#text", value: " world" },
		];

		const result = extractTextWithPositions(children);

		expect(result.text).toBe("Hello beautiful world");
		expect(result.positions).toHaveLength(3);
		expect(result.positions[0]).toMatchObject({
			startInConcat: 0,
			endInConcat: 6,
			path: [0],
		});
		expect(result.positions[1]).toMatchObject({
			startInConcat: 6,
			endInConcat: 15,
			path: [1, 0],
		});
		expect(result.positions[2]).toMatchObject({
			startInConcat: 15,
			endInConcat: 21,
			path: [2],
		});
	});

	it("should handle deeply nested elements", () => {
		const children = [
			{
				tag: "p",
				value: [
					{ tag: "#text", value: "Start " },
					{
						tag: "hi",
						value: [
							{
								tag: "em",
								value: [{ tag: "#text", value: "nested" }],
							},
						],
					},
					{ tag: "#text", value: " end" },
				],
			},
		];

		const result = extractTextWithPositions(children);

		expect(result.text).toBe("Start nested end");
		expect(result.positions).toHaveLength(3);

		expect(result.positions[0]!.path).toEqual([0, 0]);
		expect(result.positions[1]!.path).toEqual([0, 1, 0, 0]);
		expect(result.positions[2]!.path).toEqual([0, 2]);
	});

	it("should skip stop tags and track them separately", () => {
		const isStopTag = (node: { tag: string }) => node.tag === "formula";
		const children = [
			{ tag: "#text", value: "Before " },
			{
				tag: "formula",
				attributes: { notation: "tex" },
				value: [{ tag: "#text", value: "E=mc^2" }],
			},
			{ tag: "#text", value: " after" },
		];

		const result = extractTextWithPositions(children, isStopTag);

		expect(result.text).toBe("Before  after");
		expect(result.positions).toHaveLength(2);
		expect(result.stopTags).toHaveLength(1);
		expect(result.stopTags[0]).toMatchObject({
			positionInConcat: 7,
			childIndex: 1,
		});
		expect(result.stopTags[0]!.node.tag).toBe("formula");
	});

	it("should handle empty children array", () => {
		const result = extractTextWithPositions([]);

		expect(result.text).toBe("");
		expect(result.positions).toHaveLength(0);
		expect(result.flatNodes).toHaveLength(0);
		expect(result.stopTags).toHaveLength(0);
	});

	it("should handle elements with no text content", () => {
		const children = [
			{ tag: "br" },
			{ tag: "img", attributes: { src: "test.png" } },
		];

		const result = extractTextWithPositions(children);

		expect(result.text).toBe("");
		expect(result.positions).toHaveLength(0);
		expect(result.flatNodes).toHaveLength(2);
	});

	it("should track flatNodes for all traversed nodes", () => {
		const children = [
			{ tag: "#text", value: "Hello" },
			{
				tag: "span",
				value: [{ tag: "#text", value: " world" }],
			},
		];

		const result = extractTextWithPositions(children);

		expect(result.flatNodes).toHaveLength(3);
		expect(result.flatNodes[0]!.tag).toBe("#text");
		expect(result.flatNodes[1]!.tag).toBe("span");
		expect(result.flatNodes[2]!.tag).toBe("#text");
	});
});

describe("findSpannedPositions", () => {
	const positions = [
		{
			nodeIndex: 0,
			node: { tag: "#text", value: "Hello " },
			startInConcat: 0,
			endInConcat: 6,
			textStart: 0,
			textEnd: 6,
			path: [0],
		},
		{
			nodeIndex: 1,
			node: { tag: "#text", value: "world" },
			startInConcat: 6,
			endInConcat: 11,
			textStart: 0,
			textEnd: 5,
			path: [1],
		},
	];

	it("should find positions that a match spans within a single node", () => {
		const result = findSpannedPositions(positions, 0, 5);

		expect(result).toHaveLength(1);
		expect(result[0]!.startInConcat).toBe(0);
	});

	it("should find positions that a match spans across multiple nodes", () => {
		const result = findSpannedPositions(positions, 4, 8);

		expect(result).toHaveLength(2);
	});

	it("should return empty array when match is outside all positions", () => {
		const result = findSpannedPositions(positions, 20, 25);

		expect(result).toHaveLength(0);
	});

	it("should include positions that partially overlap at the start", () => {
		const result = findSpannedPositions(positions, 5, 7);

		expect(result).toHaveLength(2);
	});

	it("should include positions that partially overlap at the end", () => {
		const result = findSpannedPositions(positions, 0, 7);

		expect(result).toHaveLength(2);
	});
});

describe("getSliceBoundaries", () => {
	const position = {
		nodeIndex: 0,
		node: { tag: "#text", value: "Hello world" },
		startInConcat: 10,
		endInConcat: 21,
		textStart: 0,
		textEnd: 11,
		path: [0],
	};

	it("should calculate boundaries for a match fully within the position", () => {
		const result = getSliceBoundaries(position, 12, 17);

		expect(result).toEqual({ start: 2, end: 7 });
	});

	it("should calculate boundaries when match starts before position", () => {
		const result = getSliceBoundaries(position, 5, 15);

		expect(result).toEqual({ start: 0, end: 5 });
	});

	it("should calculate boundaries when match ends after position", () => {
		const result = getSliceBoundaries(position, 15, 25);

		expect(result).toEqual({ start: 5, end: 11 });
	});

	it("should calculate boundaries when match fully contains position", () => {
		const result = getSliceBoundaries(position, 5, 30);

		expect(result).toEqual({ start: 0, end: 11 });
	});

	it("should handle match at exact position boundaries", () => {
		const result = getSliceBoundaries(position, 10, 21);

		expect(result).toEqual({ start: 0, end: 11 });
	});
});
