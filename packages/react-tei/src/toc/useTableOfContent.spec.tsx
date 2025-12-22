import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import {
	extractHeadingsFromBody,
	useTableOfContent,
} from "./useTableOfContent";

describe("extractHeadingsFromBody", () => {
	it("should extract headings correctly", () => {
		const jsonDocumentValue: DocumentJsonValue = [
			{
				tag: "div",
				attributes: { level: "2", id: "section-1" },
				value: [
					{
						tag: "head",
						attributes: { level: "2", id: "section-1" },
						value: "Section 1 Heading",
					},
				],
			},
			{
				tag: "div",
				attributes: { level: "2", id: "section-2" },
				value: [
					{
						tag: "head",
						attributes: { level: "2", id: "section-2" },
						value: [
							{
								tag: "#text",
								value: "Section 2 Heading",
							},
						],
					},
					{
						tag: "div",
						attributes: { level: "3", id: "subsection-2-1" },
						value: [
							{
								tag: "head",
								attributes: { level: "3", id: "subsection-2-1" },
								value: [
									{
										tag: "#text",
										value: "Subsection 2.1 Heading",
									},
								],
							},
						],
					},
				],
			},
		];

		const headings = extractHeadingsFromBody(jsonDocumentValue, 3);

		expect(headings).toStrictEqual([
			{
				id: "section-1",
				content: "Section 1 Heading",
				children: [],
			},
			{
				id: "section-2",
				content: [{ tag: "#text", value: "Section 2 Heading" }],
				children: [
					{
						id: "subsection-2-1",
						content: [{ tag: "#text", value: "Subsection 2.1 Heading" }],
						children: [],
					},
				],
			},
		]);
	});

	it("should ignore divs beyond max level", () => {
		const jsonDocumentValue: DocumentJsonValue = [
			{
				tag: "div",
				attributes: { level: "2", id: "section-1" },
				value: [
					{
						tag: "head",
						attributes: { level: "2", id: "section-1" },
						value: "Section 1 Heading",
					},
					{
						tag: "div",
						attributes: { level: "3", id: "subsection-1-1" },
						value: [
							{
								tag: "head",
								attributes: { level: "3", id: "subsection-1-1" },
								value: "Subsection 1.1 Heading",
							},
						],
					},
				],
			},
		];

		const headings = extractHeadingsFromBody(jsonDocumentValue, 2);

		expect(headings).toStrictEqual([
			{
				id: "section-1",
				content: "Section 1 Heading",
				children: [],
			},
		]);
	});

	it("shoudl skip divs without id or head", () => {
		const jsonDocumentValue: DocumentJsonValue = [
			{
				tag: "div",
				attributes: {},
				value: [
					{
						tag: "p",
						value: "This div has no id or head",
					},
					{
						tag: "div",
						attributes: { level: "2", id: "subsection-1" },
						value: [
							{
								tag: "head",
								attributes: { level: "2", id: "subsection-1" },
								value: "Subsection 1 Heading",
							},
						],
					},
				],
			},
		];

		const headings = extractHeadingsFromBody(jsonDocumentValue, 3);

		expect(headings).toStrictEqual([
			{
				id: "subsection-1",
				content: "Subsection 1 Heading",
				children: [],
			},
		]);
	});

	it("should skip deivs where head is missing", () => {
		const jsonDocumentValue: DocumentJsonValue = [
			{
				tag: "div",
				attributes: { level: "2", id: "section-1" },
				value: [
					{
						tag: "p",
						value: "This div has no head",
					},
				],
			},
		];

		const headings = extractHeadingsFromBody(jsonDocumentValue, 3);

		expect(headings).toStrictEqual([]);
	});

	it.each<{ value: DocumentJsonValue; label: string }>([
		{ value: undefined, label: "undefined" },
		{ value: 42, label: "number" },
		{ value: "string", label: "string" },
	])("should return an empty array when value is $label", ({ value }) => {
		expect(extractHeadingsFromBody(value, 3)).toEqual([]);
	});
});

describe("useTableOfContent", () => {
	it("should return the table of contents with level limit to 3", async () => {
		const textDocument: DocumentJson = {
			tag: "text",
			value: [
				{
					tag: "div",
					attributes: { level: "2", id: "section-1" },
					value: [
						{
							tag: "head",
							attributes: { level: "2", id: "section-1" },
							value: "Section 1 Heading",
						},
						{
							tag: "div",
							attributes: { level: "3", id: "subsection-1-1" },
							value: [
								{
									tag: "head",
									attributes: { level: "3", id: "subsection-1-1" },
									value: "Subsection 1.1 Heading",
								},
								{
									tag: "div",
									attributes: { level: "4", id: "subsubsection-1-1-1" },
									value: [
										{
											tag: "head",
											attributes: { level: "4", id: "subsubsection-1-1-1" },
											value: "Subsubsection 1.1.1 Heading",
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const { result } = await renderHook(() => useTableOfContent(textDocument));

		expect(result.current).toStrictEqual([
			{
				id: "section-1",
				content: "Section 1 Heading",
				children: [
					{
						id: "subsection-1-1",
						content: "Subsection 1.1 Heading",
						children: [],
					},
				],
			},
		]);
	});
});
