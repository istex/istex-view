import { describe, expect, it } from "vitest";
import type { Match } from "./buildResultFromMatches";
import {
	createPartialStructureAtPath,
	findAllMatches,
	highlightTermsInChildren,
	removeOverlappingMatches,
} from "./highlightTermsInChildren";
import type { TermCountByGroup } from "./termCountRegistry";
import type { HighlightTag, TermData } from "./types";

const createRegistry = (): TermCountByGroup => ({});

describe("highlightTermsInChildren", () => {
	describe("findAllMatches", () => {
		it("should return empty array when no matches", () => {
			const text = "Hello world";
			const termDataList: TermData[] = [
				{ termRegex: /foo/g, term: "foo", groups: ["group1"] },
			];

			const result = findAllMatches(text, termDataList);

			expect(result).toEqual([]);
		});

		it("should find single match", () => {
			const text = "Hello world";
			const termDataList: TermData[] = [
				{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
			];

			const result = findAllMatches(text, termDataList);

			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				index: 0,
				length: 5,
				text: "Hello",
			});
		});

		it("should find multiple matches of same term", () => {
			const text = "Hello Hello Hello";
			const termDataList: TermData[] = [
				{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
			];

			const result = findAllMatches(text, termDataList);

			expect(result).toHaveLength(3);
			expect(result[0]!.index).toBe(0);
			expect(result[1]!.index).toBe(6);
			expect(result[2]!.index).toBe(12);
		});

		it("should find matches from multiple terms", () => {
			const text = "Hello beautiful world";
			const termDataList: TermData[] = [
				{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
				{ termRegex: /world/g, term: "world", groups: ["group2"] },
			];

			const result = findAllMatches(text, termDataList);

			expect(result).toHaveLength(2);
			expect(result[0]!.text).toBe("Hello");
			expect(result[1]!.text).toBe("world");
		});

		it("should sort matches by position", () => {
			const text = "world Hello";
			const termDataList: TermData[] = [
				{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
				{ termRegex: /world/g, term: "world", groups: ["group2"] },
			];

			const result = findAllMatches(text, termDataList);

			expect(result[0]!.text).toBe("world");
			expect(result[1]!.text).toBe("Hello");
		});

		it("should sort overlapping matches by length (longer first)", () => {
			const text = "New York City";
			const termDataList: TermData[] = [
				{ termRegex: /New York/g, term: "New York", groups: ["group1"] },
				{
					termRegex: /New York City/g,
					term: "New York City",
					groups: ["group2"],
				},
			];

			const result = findAllMatches(text, termDataList);

			expect(result).toHaveLength(2);
			expect(result[0]!.text).toBe("New York City");
			expect(result[1]!.text).toBe("New York");
		});
	});

	describe("removeOverlappingMatches", () => {
		it("should return empty array for empty input", () => {
			const result = removeOverlappingMatches([]);

			expect(result).toEqual([]);
		});

		it("should keep non-overlapping matches", () => {
			const matches: Match[] = [
				{
					index: 0,
					length: 5,
					text: "Hello",
					termData: { termRegex: /Hello/g, term: "Hello", groups: ["g1"] },
				},
				{
					index: 10,
					length: 5,
					text: "world",
					termData: { termRegex: /world/g, term: "world", groups: ["g1"] },
				},
			];

			const result = removeOverlappingMatches(matches);

			expect(result).toHaveLength(2);
		});

		it("should remove overlapping matches keeping the first one", () => {
			const matches: Match[] = [
				{
					index: 0,
					length: 13,
					text: "New York City",
					termData: {
						termRegex: /New York City/g,
						term: "New York City",
						groups: ["g1"],
					},
				},
				{
					index: 0,
					length: 8,
					text: "New York",
					termData: {
						termRegex: /New York/g,
						term: "New York",
						groups: ["g1"],
					},
				},
			];

			const result = removeOverlappingMatches(matches);

			expect(result).toHaveLength(1);
			expect(result[0]!.text).toBe("New York City");
		});

		it("should handle partially overlapping matches", () => {
			const matches: Match[] = [
				{
					index: 0,
					length: 8,
					text: "New York",
					termData: {
						termRegex: /New York/g,
						term: "New York",
						groups: ["g1"],
					},
				},
				{
					index: 4,
					length: 9,
					text: "York City",
					termData: {
						termRegex: /York City/g,
						term: "York City",
						groups: ["g1"],
					},
				},
			];

			const result = removeOverlappingMatches(matches);

			expect(result).toHaveLength(1);
			expect(result[0]!.text).toBe("New York");
		});

		it("should allow adjacent matches", () => {
			const matches: Match[] = [
				{
					index: 0,
					length: 5,
					text: "Hello",
					termData: { termRegex: /Hello/g, term: "Hello", groups: ["g1"] },
				},
				{
					index: 5,
					length: 5,
					text: "World",
					termData: { termRegex: /World/g, term: "World", groups: ["g1"] },
				},
			];

			const result = removeOverlappingMatches(matches);

			expect(result).toHaveLength(2);
		});
	});

	describe("createPartialStructureAtPath", () => {
		it("should return text node with sliced text when path is empty and node is text", () => {
			const node = { tag: "#text", value: "Hello world" };

			const result = createPartialStructureAtPath(node, [], "Hello");

			expect(result).toEqual({ tag: "#text", value: "Hello" });
		});

		it("should return node unchanged when path is empty and node is not text", () => {
			const node = { tag: "hi", value: [{ tag: "#text", value: "Hello" }] };

			const result = createPartialStructureAtPath(node, [], "Hello");

			expect(result).toBe(node);
		});

		it("should return node when value is not an array", () => {
			const node = { tag: "#text", value: "Hello" };

			const result = createPartialStructureAtPath(node, [0], "Hi");

			expect(result).toBe(node);
		});

		it("should return node when child index does not exist", () => {
			const node = { tag: "hi", value: [{ tag: "#text", value: "Hello" }] };

			const result = createPartialStructureAtPath(node, [5], "Hi");

			expect(result).toBe(node);
		});

		it("should create partial structure with sliced text", () => {
			const node = {
				tag: "hi",
				value: [{ tag: "#text", value: "Hello world" }],
			};

			const result = createPartialStructureAtPath(node, [0], "Hello");

			expect(result).toEqual({
				tag: "hi",
				value: [{ tag: "#text", value: "Hello" }],
			});
		});

		it("should handle deeply nested structures", () => {
			const node = {
				tag: "div",
				value: [
					{
						tag: "hi",
						value: [{ tag: "#text", value: "Deep text" }],
					},
				],
			};

			const result = createPartialStructureAtPath(node, [0, 0], "Deep");

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
	});

	it("should return original children when no text content", () => {
		const children = [{ tag: "div", value: [] }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toBe(children);
	});

	it("should return original children when no matches found", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /foo/g, term: "foo", groups: ["group1"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toBe(children);
	});

	it("should highlight single term in text node", () => {
		const children = [{ tag: "#text", value: "Hello world" }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
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

	it("should highlight multiple terms", () => {
		const children = [{ tag: "#text", value: "Hello beautiful world" }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
			{ termRegex: /world/g, term: "world", groups: ["group2"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(3);
		expect(nodes[0]).toMatchObject({ tag: "highlight" });
		expect(nodes[1]).toEqual({ tag: "#text", value: " beautiful " });
		expect(nodes[2]).toMatchObject({ tag: "highlight" });
	});

	it("should highlight term spanning multiple text nodes", () => {
		const children = [
			{ tag: "#text", value: "Prince " },
			{ tag: "#text", value: "Charles" },
		];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{
				termRegex: /Prince Charles/g,
				term: "Prince Charles",
				groups: ["group1"],
			},
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(1);
		expect(nodes[0]).toMatchObject({
			tag: "highlight",
			attributes: { groups: ["group1"], term: "prince-charles" },
		});
	});

	it("should highlight term spanning text node and nested tag", () => {
		const children = [
			{ tag: "#text", value: "Prince " },
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
		];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{
				termRegex: /Prince Charles/g,
				term: "Prince Charles",
				groups: ["group1"],
			},
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(1);
		expect((nodes[0] as HighlightTag).value).toEqual([
			{ tag: "#text", value: "Prince " },
			{ tag: "hi", value: [{ tag: "#text", value: "Charles" }] },
		]);
	});

	it("should skip stop tags content but preserve them in output", () => {
		const children = [
			{ tag: "#text", value: "Text " },
			{ tag: "formula", value: "x=1" },
			{ tag: "#text", value: " more text" },
		];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /more/g, term: "more", groups: ["group1"] },
		];
		const isStopTag = (node: { tag: string }) => node.tag === "formula";

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
			isStopTag,
		);

		expect(nodes.some((n) => n.tag === "formula")).toBe(true);
		expect(nodes.some((n) => n.tag === "highlight")).toBe(true);
	});

	it("should handle overlapping terms keeping longer match", () => {
		const children = [{ tag: "#text", value: "New York City" }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /New York/g, term: "New York", groups: ["group1"] },
			{
				termRegex: /New York City/g,
				term: "New York City",
				groups: ["group2"],
			},
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(1);
		expect((nodes[0] as HighlightTag).attributes.term).toBe("new-york-city");
	});

	it("should use pre-computed value for nested terms", () => {
		const children = [{ tag: "#text", value: "New York City" }];
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

		const termDataList: TermData[] = [
			{
				termRegex: /New York City/g,
				term: "New York City",
				groups: ["group1+group2"],
				value: preComputedValue,
			},
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(1);
		expect((nodes[0] as HighlightTag).value).toEqual(preComputedValue);
	});

	it("should handle deeply nested tags", () => {
		const children = [
			{
				tag: "div",
				value: [
					{
						tag: "hi",
						value: [{ tag: "#text", value: "Hello world" }],
					},
				],
			},
		];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(2);
		expect(nodes[0]).toMatchObject({ tag: "highlight" });
	});

	it("should handle match at end of text", () => {
		const children = [{ tag: "#text", value: "Say Hello" }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(2);
		expect(nodes[0]).toEqual({ tag: "#text", value: "Say " });
		expect(nodes[1]).toMatchObject({ tag: "highlight" });
	});

	it("should handle match at beginning of text", () => {
		const children = [{ tag: "#text", value: "Hello there" }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(2);
		expect(nodes[0]).toMatchObject({ tag: "highlight" });
		expect(nodes[1]).toEqual({ tag: "#text", value: " there" });
	});

	it("should handle entire text as match", () => {
		const children = [{ tag: "#text", value: "Hello" }];
		const registry = createRegistry();
		const termDataList: TermData[] = [
			{ termRegex: /Hello/g, term: "Hello", groups: ["group1"] },
		];

		const { nodes } = highlightTermsInChildren(
			registry,
			children,
			termDataList,
		);

		expect(nodes).toHaveLength(1);
		expect(nodes[0]).toMatchObject({ tag: "highlight" });
	});
});
