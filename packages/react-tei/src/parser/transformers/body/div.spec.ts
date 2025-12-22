import { describe, expect, it } from "vitest";
import type { DocumentJson } from "../../document";
import type { SectionContext } from "../type";
import { transformDiv } from "./div";

describe("transformDiv", () => {
	it("should add an id and level to div attributes if div has an head", () => {
		const div: DocumentJson = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section Title",
				},
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							attributes: {},
							value: "This is a paragraph.",
						},
					],
				},
			],
		};

		const { node } = transformDiv({ section: null }, div);

		expect(node).toStrictEqual({
			tag: "div",
			attributes: {
				id: expect.any(String),
				level: "2",
			},
			value: [
				{
					tag: "head",
					attributes: {
						id: expect.any(String),
						level: "2",
					},
					value: "Section Title",
				},
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							attributes: {},
							value: "This is a paragraph.",
						},
					],
				},
			],
		});
	});

	it('should set level to "3" if there is an existing section in context', () => {
		const div: DocumentJson = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Subsection Title",
				},
			],
		};

		const initialContext = {
			section: {
				id: "section-abc123",
				level: "2",
			},
		};

		const { node } = transformDiv(initialContext, div);

		expect(node).toStrictEqual({
			tag: "div",
			attributes: {
				id: expect.any(String),
				level: "3",
			},
			value: [
				{
					tag: "head",
					attributes: {
						id: expect.any(String),
						level: "3",
					},
					value: "Subsection Title",
				},
			],
		});
	});

	it("should return updated context with new section info", () => {
		const div: DocumentJson = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "head",
					attributes: {},
					value: "Section Title",
				},
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							attributes: {},
							value: "This is a paragraph.",
						},
					],
				},
			],
		};

		const { context } = transformDiv({ section: null }, div);
		expect(context).toStrictEqual({
			section: {
				id: expect.any(String),
				level: "2",
			},
		});
	});

	it("should not modify div attributes if div does not have an head", () => {
		const div = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							attributes: {},
							value: "This is a paragraph.",
						},
					],
				},
			],
		};

		const { node } = transformDiv({ section: null }, div);
		expect(node).toStrictEqual(div);
	});

	it.each<SectionContext | null>([
		null,
		{ id: "sec1", level: "1" },
	])("should return the original context if no modifications are made", (section) => {
		const div = {
			tag: "div",
			attributes: {},
			value: [
				{
					tag: "p",
					attributes: {},
					value: [
						{
							tag: "#text",
							attributes: {},
							value: "This is a paragraph.",
						},
					],
				},
			],
		};

		const initialContext = { section };
		const { context } = transformDiv(initialContext, div);
		expect(context).toBe(initialContext);
	});
});
