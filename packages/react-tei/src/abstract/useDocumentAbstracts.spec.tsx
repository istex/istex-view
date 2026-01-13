import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import { useDocumentAbstracts } from "./useDocumentAbstracts";

describe("useDocumentAbstracts", () => {
	it("should return an empty array if teiHeader is undefined", async () => {
		const { result } = await renderHook(() => useDocumentAbstracts(undefined));

		expect(result.current).toEqual([]);
	});

	it.each<DocumentJsonValue>([
		[],
		[
			{
				tag: "fileDesc",
				attributes: {},
				value: [],
			},
			{
				tag: "profileDesc",
				attributes: {},
				value: [],
			},
		],
	])("should return an empty array if no abstract is present", async (value) => {
		const headerJson: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value,
		};

		const { result } = await renderHook(() => useDocumentAbstracts(headerJson));

		expect(result.current).toEqual([]);
	});

	it("should return a single abstract", async () => {
		const headerJson: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "fileDesc",
					attributes: {},
					value: [],
				},
				{
					tag: "profileDesc",
					attributes: {},
					value: [
						{
							tag: "abstract",
							attributes: {},
							value: [
								{
									tag: "head",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "Abstract",
										},
									],
								},
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "This is a simple ",
										},
										{
											tag: "hi",
											attributes: {},
											value: [
												{
													tag: "#text",
													attributes: {},
													value: "abstract",
												},
											],
										},

										{
											tag: "#text",
											attributes: {},
											value: " paragraph.",
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const { result } = await renderHook(() => useDocumentAbstracts(headerJson));

		expect(result.current).toStrictEqual([
			{
				tag: "abstract",
				attributes: {},
				value: [
					{
						tag: "head",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "Abstract",
							},
						],
					},
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is a simple ",
							},
							{
								tag: "hi",
								attributes: {},
								value: [
									{
										tag: "#text",
										attributes: {},
										value: "abstract",
									},
								],
							},

							{
								tag: "#text",
								attributes: {},
								value: " paragraph.",
							},
						],
					},
				],
			},
		]);
	});

	it("should return multiple abstracts for multi-lingual documents", async () => {
		const headerJson: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "fileDesc",
					attributes: {},
					value: [],
				},
				{
					tag: "profileDesc",
					attributes: {},
					value: [
						{
							tag: "abstract",
							attributes: { "@xml:lang": "en" },
							value: [
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "This is the English abstract.",
										},
									],
								},
							],
						},
						{
							tag: "abstract",
							attributes: { "@xml:lang": "fr" },
							value: [
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "Ceci est le résumé en français.",
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const { result } = await renderHook(() => useDocumentAbstracts(headerJson));

		expect(result.current).toStrictEqual([
			{
				tag: "abstract",
				attributes: { "@xml:lang": "en" },
				value: [
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is the English abstract.",
							},
						],
					},
				],
			},
			{
				tag: "abstract",
				attributes: { "@xml:lang": "fr" },
				value: [
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "Ceci est le résumé en français.",
							},
						],
					},
				],
			},
		]);
	});

	it('should filter abstracts with head content equals to "Highlights"', async () => {
		const headerJson: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "profileDesc",
					attributes: {},
					value: [
						{
							tag: "abstract",
							attributes: {
								"@xml:lang": "en",
							},
							value: [
								{
									tag: "head",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "Highlights",
										},
									],
								},
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "These are the highlights.",
										},
									],
								},
							],
						},
						{
							tag: "abstract",
							attributes: {
								"@xml:lang": "en",
							},
							value: [
								{
									tag: "head",
									attributes: {},
									value: [{ tag: "#text", attributes: {}, value: "Abstract" }],
								},
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "This is a regular abstract.",
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const { result } = await renderHook(() => useDocumentAbstracts(headerJson));
		expect(result.current).toStrictEqual([
			{
				tag: "abstract",
				attributes: {
					"@xml:lang": "en",
				},
				value: [
					{
						tag: "head",
						attributes: {},
						value: [{ tag: "#text", attributes: {}, value: "Abstract" }],
					},
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is a regular abstract.",
							},
						],
					},
				],
			},
		]);
	});
});
