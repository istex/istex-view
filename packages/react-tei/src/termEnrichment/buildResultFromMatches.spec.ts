import { describe, expect, it } from "vitest";
import {
	buildResultFromMatches,
	computeHighlightValue,
	createHighlightNode,
	getNodesBeforeMatch,
	getRemainingNodes,
	getStopTagsAtPosition,
	getStopTagsInRange,
	isCrossTagMatch,
	type Match,
} from "./buildResultFromMatches";
import {
	extractTextWithPositions,
	type StopTagPosition,
} from "./extractTextWithPositions";
import type { TermCountByGroup } from "./termCountRegistry";
import type { HighlightTag, TermData } from "./types";

const createRegistry = (): TermCountByGroup => ({});

describe("buildResultFromMatches", () => {
	describe("getStopTagsAtPosition", () => {
		it("should return empty array when no stop tags at position", () => {
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 5,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getStopTagsAtPosition(stopTags, 0, insertedStopTags);

			expect(result).toEqual([]);
		});

		it("should return stop tag at matching position", () => {
			const stopTags = [
				{
					positionInConcat: 5,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getStopTagsAtPosition(stopTags, 5, insertedStopTags);

			expect(result).toEqual([{ tag: "formula", value: "x=1" }]);
			expect(insertedStopTags.has(0)).toBe(true);
		});

		it("should not return already inserted stop tags", () => {
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 5,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>([0]);

			const result = getStopTagsAtPosition(stopTags, 5, insertedStopTags);

			expect(result).toEqual([]);
		});

		it("should return multiple stop tags at same position", () => {
			const stopTags = [
				{
					positionInConcat: 5,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
				{
					positionInConcat: 5,
					node: { tag: "formula", value: "y=2" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getStopTagsAtPosition(stopTags, 5, insertedStopTags);

			expect(result).toHaveLength(2);
			expect(insertedStopTags.has(0)).toBe(true);
			expect(insertedStopTags.has(1)).toBe(true);
		});
	});

	describe("isCrossTagMatch", () => {
		it("should return false for match within single text node", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);

			const result = isCrossTagMatch(positions, 0, 5);

			expect(result).toBe(false);
		});

		it("should return true for match spanning multiple text nodes", () => {
			const children = [
				{ tag: "#text", value: "Hello " },
				{ tag: "#text", value: "world" },
			];
			const { positions } = extractTextWithPositions(children);

			// "lo world" spans both nodes
			const result = isCrossTagMatch(positions, 3, 11);

			expect(result).toBe(true);
		});

		it("should return true for match spanning text node and nested tag", () => {
			const children = [
				{ tag: "#text", value: "Hello " },
				{ tag: "hi", value: [{ tag: "#text", value: "world" }] },
			];
			const { positions } = extractTextWithPositions(children);

			// "Hello world" spans both
			const result = isCrossTagMatch(positions, 0, 11);

			expect(result).toBe(true);
		});

		it("should return false for match within nested tag only", () => {
			const children = [
				{ tag: "#text", value: "Hello " },
				{ tag: "hi", value: [{ tag: "#text", value: "beautiful world" }] },
			];
			const { positions } = extractTextWithPositions(children);

			// "beautiful" is only within the <hi> tag
			const result = isCrossTagMatch(positions, 6, 15);

			expect(result).toBe(false);
		});
	});

	describe("getStopTagsInRange", () => {
		it("should return empty array when no stop tags in range", () => {
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 10,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getStopTagsInRange(stopTags, 0, 5, insertedStopTags);

			expect(result).toEqual([]);
		});

		it("should return stop tags within the range", () => {
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 3,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
				{
					positionInConcat: 5,
					node: { tag: "formula", value: "y=2" },
					childIndex: 1,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getStopTagsInRange(stopTags, 0, 5, insertedStopTags);

			expect(result).toHaveLength(2);
			expect(result[0]).toEqual({ tag: "formula", value: "x=1" });
			expect(result[1]).toEqual({ tag: "formula", value: "y=2" });
		});

		it("should not include stop tags at startPos", () => {
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 0,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
				{
					positionInConcat: 3,
					node: { tag: "formula", value: "y=2" },
					childIndex: 1,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getStopTagsInRange(stopTags, 0, 5, insertedStopTags);

			// Position 0 is not included (range is startPos+1 to endPos)
			expect(result).toHaveLength(1);
			expect(result[0]).toEqual({ tag: "formula", value: "y=2" });
		});

		it("should mark stop tags as inserted", () => {
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 3,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();

			getStopTagsInRange(stopTags, 0, 5, insertedStopTags);

			expect(insertedStopTags.has(0)).toBe(true);
		});
	});

	describe("computeHighlightValue", () => {
		it("should return text node array for simple single-tag match", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);
			const match: Match = {
				index: 0,
				length: 5,
				text: "Hello",
				termData: {
					termRegex: /Hello/g,
					term: "Hello",
					groups: ["group1"],
				},
			};

			const result = computeHighlightValue(match, children, positions);

			expect(result).toEqual([{ tag: "#text", value: "Hello" }]);
		});

		it("should return pre-computed value for nested terms", () => {
			const children = [{ tag: "#text", value: "New York City" }];
			const { positions } = extractTextWithPositions(children);
			const preComputedValue: HighlightTag[] = [
				{
					tag: "highlight",
					value: [{ tag: "#text", value: "New York" }],
					attributes: {
						groups: ["group1"],
						term: "new-york",
					} as HighlightTag["attributes"],
				},
			];
			const match: Match = {
				index: 0,
				length: 13,
				text: "New York City",
				termData: {
					termRegex: /New York City/g,
					term: "New York City",
					groups: ["group1"],
					value: preComputedValue,
				},
			};

			const result = computeHighlightValue(match, children, positions);

			expect(result).toEqual(preComputedValue);
		});

		it("should reconstruct nodes for cross-tag match", () => {
			const children = [
				{ tag: "#text", value: "Prince " },
				{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
			];
			const { positions } = extractTextWithPositions(children);
			const match: Match = {
				index: 0,
				length: 14,
				text: "Prince Charles",
				termData: {
					termRegex: /Prince Charles/g,
					term: "Prince Charles",
					groups: ["group1"],
				},
			};

			const result = computeHighlightValue(match, children, positions);

			expect(result).toEqual([
				{ tag: "#text", value: "Prince " },
				{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
			]);
		});
	});

	describe("createHighlightNode", () => {
		it("should create highlight node with correct attributes", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);
			const match: Match = {
				index: 0,
				length: 5,
				text: "Hello",
				termData: {
					termRegex: /Hello/g,
					term: "Hello",
					groups: ["group1", "group2"],
				},
			};

			const result = createHighlightNode(match, children, positions);

			expect(result.tag).toBe("highlight");
			expect(result.attributes.groups).toEqual(["group1", "group2"]);
			expect(result.attributes.term).toBe("hello");
		});

		it("should kebab-casify term name", () => {
			const children = [{ tag: "#text", value: "New York City" }];
			const { positions } = extractTextWithPositions(children);
			const match: Match = {
				index: 0,
				length: 13,
				text: "New York City",
				termData: {
					termRegex: /New York City/g,
					term: "New York City",
					groups: ["group1"],
				},
			};

			const result = createHighlightNode(match, children, positions);

			expect(result.attributes.term).toBe("new-york-city");
		});

		it("should include computed highlight value", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);
			const match: Match = {
				index: 0,
				length: 5,
				text: "Hello",
				termData: {
					termRegex: /Hello/g,
					term: "Hello",
					groups: ["group1"],
				},
			};

			const result = createHighlightNode(match, children, positions);

			expect(result.value).toEqual([{ tag: "#text", value: "Hello" }]);
		});
	});

	describe("getNodesBeforeMatch", () => {
		it("should return only stop tags when match starts at lastEnd", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 0,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();
			const match: Match = {
				index: 0,
				length: 5,
				text: "Hello",
				termData: {
					termRegex: /Hello/g,
					term: "Hello",
					groups: ["group1"],
				},
			};

			const result = getNodesBeforeMatch(
				match,
				0,
				children,
				positions,
				stopTags,
				insertedStopTags,
			);

			expect(result).toEqual([{ tag: "formula", value: "x=1" }]);
		});

		it("should return content between lastEnd and match", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);
			const match: Match = {
				index: 6,
				length: 5,
				text: "world",
				termData: {
					termRegex: /world/g,
					term: "world",
					groups: ["group1"],
				},
			};

			const result = getNodesBeforeMatch(
				match,
				0,
				children,
				positions,
				[],
				new Set(),
			);

			expect(result).toEqual([{ tag: "#text", value: "Hello " }]);
		});

		it("should include stop tags at lastEnd and in range", () => {
			const children = [{ tag: "#text", value: "Hello beautiful world" }];
			const { positions } = extractTextWithPositions(children);
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 0,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
				{
					positionInConcat: 6,
					node: { tag: "formula", value: "y=2" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();
			const match: Match = {
				index: 16,
				length: 5,
				text: "world",
				termData: {
					termRegex: /world/g,
					term: "world",
					groups: ["group1"],
				},
			};

			const result = getNodesBeforeMatch(
				match,
				0,
				children,
				positions,
				stopTags,
				insertedStopTags,
			);

			// Should include: stop tag at 0, content "Hello beautiful ", stop tag at 6
			expect(result.some((n) => n.tag === "formula" && n.value === "x=1")).toBe(
				true,
			);
			expect(result.some((n) => n.tag === "formula" && n.value === "y=2")).toBe(
				true,
			);
			expect(result.some((n) => n.tag === "#text")).toBe(true);
		});
	});

	describe("getRemainingNodes", () => {
		it("should return empty when lastEnd equals textLength", () => {
			const children = [{ tag: "#text", value: "Hello" }];
			const { positions } = extractTextWithPositions(children);

			const result = getRemainingNodes(
				5,
				5,
				children,
				positions,
				[],
				new Set(),
			);

			expect(result).toEqual([]);
		});

		it("should return remaining text after lastEnd", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);

			const result = getRemainingNodes(
				5,
				11,
				children,
				positions,
				[],
				new Set(),
			);

			expect(result).toEqual([{ tag: "#text", value: " world" }]);
		});

		it("should include uninserted stop tags", () => {
			const children = [{ tag: "#text", value: "Hello" }];
			const { positions } = extractTextWithPositions(children);
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 10,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getRemainingNodes(
				5,
				5,
				children,
				positions,
				stopTags,
				insertedStopTags,
			);

			expect(result).toEqual([{ tag: "formula", value: "x=1" }]);
		});

		it("should not include already inserted stop tags", () => {
			const children = [{ tag: "#text", value: "Hello" }];
			const { positions } = extractTextWithPositions(children);
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 10,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>([0]);

			const result = getRemainingNodes(
				5,
				5,
				children,
				positions,
				stopTags,
				insertedStopTags,
			);

			expect(result).toEqual([]);
		});

		it("should include stop tags at lastEnd position", () => {
			const children = [{ tag: "#text", value: "Hello world" }];
			const { positions } = extractTextWithPositions(children);
			const stopTags: StopTagPosition[] = [
				{
					positionInConcat: 5,
					node: { tag: "formula", value: "x=1" },
					childIndex: 0,
				},
			];
			const insertedStopTags = new Set<number>();

			const result = getRemainingNodes(
				5,
				11,
				children,
				positions,
				stopTags,
				insertedStopTags,
			);

			expect(result[0]).toEqual({ tag: "formula", value: "x=1" });
			expect(result.some((n) => n.tag === "#text")).toBe(true);
		});
	});

	it("should return original content when no matches", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			[],
		);

		expect(nodes).toEqual([{ tag: "#text", value: "Hello world" }]);
	});

	it("should wrap single match in highlight tag", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /Hello/g,
			term: "Hello",
			groups: ["group1"],
		};
		const matches: Match[] = [{ index: 0, length: 5, text: "Hello", termData }];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(nodes).toHaveLength(2);
		expect(nodes[0]).toMatchObject({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "hello" },
		});
		expect((nodes[0] as HighlightTag).value).toEqual([
			{ tag: "#text", value: "Hello" },
		]);
		expect(nodes[1]).toEqual({ tag: "#text", value: " world" });
	});

	it("should handle match in the middle of text", () => {
		const children = [{ tag: "#text", value: "Say Hello there" }];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /Hello/g,
			term: "Hello",
			groups: ["group1"],
		};
		const matches: Match[] = [{ index: 4, length: 5, text: "Hello", termData }];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(nodes).toHaveLength(3);
		expect(nodes[0]).toEqual({ tag: "#text", value: "Say " });
		expect(nodes[1]).toMatchObject({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "hello" },
		});
		expect(nodes[2]).toEqual({ tag: "#text", value: " there" });
	});

	it("should handle multiple matches", () => {
		const children = [{ tag: "#text", value: "Hello Hello Hello" }];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /Hello/g,
			term: "Hello",
			groups: ["group1"],
		};
		const matches: Match[] = [
			{ index: 0, length: 5, text: "Hello", termData },
			{ index: 6, length: 5, text: "Hello", termData },
			{ index: 12, length: 5, text: "Hello", termData },
		];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(nodes).toHaveLength(5);
		expect(nodes[0]).toMatchObject({ tag: "highlight" });
		expect(nodes[1]).toEqual({ tag: "#text", value: " " });
		expect(nodes[2]).toMatchObject({ tag: "highlight" });
		expect(nodes[3]).toEqual({ tag: "#text", value: " " });
		expect(nodes[4]).toMatchObject({ tag: "highlight" });
	});

	it("should handle cross-tag match preserving nested tags", () => {
		const children = [
			{ tag: "#text", value: "Prince " },
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
		];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /Prince Charles/g,
			term: "Prince Charles",
			groups: ["group1"],
		};
		const matches: Match[] = [
			{ index: 0, length: 14, text: "Prince Charles", termData },
		];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(nodes).toHaveLength(1);
		expect(nodes[0]).toMatchObject({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "prince-charles" },
		});
		// The value should preserve the <hi> tag
		expect((nodes[0] as HighlightTag).value).toEqual([
			{ tag: "#text", value: "Prince " },
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
		]);
	});

	it("should use pre-computed value for non-cross-tag nested terms", () => {
		const children = [{ tag: "#text", value: "New York City" }];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const preComputedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "New " }],
				attributes: {
					groups: ["group1"],
					term: "new-york",
				} as HighlightTag["attributes"],
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "York" }],
				attributes: { groups: ["group1", "group2"], term: null } as any,
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: " City" }],
				attributes: { groups: ["group2"], term: "york-city" },
			},
		];

		const termData: TermData = {
			termRegex: /New York City/g,
			term: "New York City",
			groups: ["group1", "group2"],
			value: preComputedValue,
		};
		const matches: Match[] = [
			{ index: 0, length: 13, text: "New York City", termData },
		];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(nodes).toHaveLength(1);
		expect((nodes[0] as HighlightTag).value).toEqual(preComputedValue);
	});

	it("should reconstruct cross-tag match with nested term structure", () => {
		const children = [
			{ tag: "#text", value: "Prince " },
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
			{ tag: "#text", value: " The Bold" },
		];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const preComputedValue: HighlightTag[] = [
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Prince " }],
				attributes: {
					groups: ["group1"],
					term: "prince-charles",
				} as HighlightTag["attributes"],
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: "Charles" }],
				attributes: { groups: ["group1", "group2"], term: null } as any,
			},
			{
				tag: "highlight",
				value: [{ tag: "#text", value: " The Bold" }],
				attributes: { groups: ["group2"], term: "charles-the-bold" },
			},
		];

		const termData: TermData = {
			termRegex: /Prince Charles The Bold/g,
			term: "Prince Charles The Bold",
			groups: ["group1", "group2"],
			value: preComputedValue,
		};
		const matches: Match[] = [
			{ index: 0, length: 23, text: "Prince Charles The Bold", termData },
		];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(nodes).toHaveLength(1);
		const highlight = nodes[0] as HighlightTag;
		expect(highlight.tag).toBe("highlight");

		// The reconstructed value should preserve <hi> tag
		const innerHighlights = highlight.value as HighlightTag[];
		expect(innerHighlights).toHaveLength(3);
		expect(innerHighlights[1]!.value).toEqual([
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
		]);
	});

	it("should return updated registry with incremented term count", () => {
		const children = [{ tag: "#text", value: "Hello Hello" }];
		const extraction = extractTextWithPositions(children);
		// Pre-initialize the registry with the expected group and term
		const registry: TermCountByGroup = {
			group1: { hello: 0 },
		};

		const termData: TermData = {
			termRegex: /Hello/g,
			term: "Hello",
			groups: ["group1"],
			value: "Hello",
		};
		const matches: Match[] = [
			{ index: 0, length: 5, text: "Hello", termData },
			{ index: 6, length: 5, text: "Hello", termData },
		];

		const { registry: updatedRegistry } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(updatedRegistry.group1?.hello).toBe(2);
		expect(registry.group1?.hello).toBe(0); // Original unchanged
	});

	it("should handle stop tags before match", () => {
		const children = [
			{ tag: "#text", value: "Text " },
			{ tag: "formula", value: "x=1" },
			{ tag: "#text", value: " more text" },
		];
		const isStopTag = (node: { tag: string }) => node.tag === "formula";
		const extraction = extractTextWithPositions(children, isStopTag);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /more/g,
			term: "more",
			groups: ["group1"],
		};
		const matches: Match[] = [{ index: 6, length: 4, text: "more", termData }];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		// Should include: "Text ", formula, " ", highlight(more), " text"
		expect(nodes.some((n) => n.tag === "formula")).toBe(true);
		expect(nodes.some((n) => n.tag === "highlight")).toBe(true);
	});

	it("should handle stop tags after all matches", () => {
		const children = [
			{ tag: "#text", value: "Hello world " },
			{ tag: "formula", value: "x=1" },
		];
		const isStopTag = (node: { tag: string }) => node.tag === "formula";
		const extraction = extractTextWithPositions(children, isStopTag);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /Hello/g,
			term: "Hello",
			groups: ["group1"],
		};
		const matches: Match[] = [{ index: 0, length: 5, text: "Hello", termData }];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		// Should include the formula at the end
		expect(nodes[nodes.length - 1]).toEqual({ tag: "formula", value: "x=1" });
	});

	it("should handle match at the very end of text", () => {
		const children = [{ tag: "#text", value: "Say Hello" }];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /Hello/g,
			term: "Hello",
			groups: ["group1"],
		};
		const matches: Match[] = [{ index: 4, length: 5, text: "Hello", termData }];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect(nodes).toHaveLength(2);
		expect(nodes[0]).toEqual({ tag: "#text", value: "Say " });
		expect(nodes[1]).toMatchObject({ tag: "highlight" });
	});

	it("should kebab-casify term in highlight attributes", () => {
		const children = [{ tag: "#text", value: "New York City" }];
		const extraction = extractTextWithPositions(children);
		const registry = createRegistry();

		const termData: TermData = {
			termRegex: /New York City/g,
			term: "New York City",
			groups: ["group1"],
		};
		const matches: Match[] = [
			{ index: 0, length: 13, text: "New York City", termData },
		];

		const { nodes } = buildResultFromMatches(
			registry,
			children,
			extraction,
			matches,
		);

		expect((nodes[0] as HighlightTag).attributes.term).toBe("new-york-city");
	});
});
