import { describe, expect, it, vi } from "vitest";
import { parseTeeft } from "./parseTeeft";

describe("parseTeeft", () => {
	it("should return empty object when teeftEnrichment is null", () => {
		const result = parseTeeft(null);
		expect(result).toEqual([]);
	});

	it("should return empty object when teeftEnrichment is undefined", () => {
		const result = parseTeeft(undefined);
		expect(result).toEqual([]);
	});

	it("should return empty object when ns1:listAnnotation is not found", () => {
		const result = parseTeeft([
			{
				tag: "someOtherTag",
				value: [],
			},
		]);
		expect(result).toEqual([]);
	});

	it("should return empty object when ns1:listAnnotation value is not an array", () => {
		const result = parseTeeft([
			{
				tag: "TEI",
				value: [
					{
						tag: "ns1:listAnnotation",
						value: "not an array",
					},
				],
			},
		]);
		expect(result).toEqual([]);
	});

	it("should return empty object and warn when listAnnotation type is not rd-teeft", () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "unknown-type",
				},
				value: [],
			},
		]);

		expect(result).toEqual([]);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Unknown teeft listAnnotation type",
			expect.objectContaining({
				tag: "ns1:listAnnotation",
				attributes: { "@type": "unknown-type" },
			}),
		);
		consoleWarnSpy.mockRestore();
	});

	it("should return empty object when keywords tag is not found", () => {
		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "rd-teeft",
				},
				value: [
					{
						tag: "someOtherTag",
						value: [],
					},
				],
			},
		]);
		expect(result).toEqual([]);
	});

	it("should return empty object when keywords value is not an array", () => {
		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "rd-teeft",
				},
				value: [
					{
						tag: "keywords",
						value: "not an array",
					},
				],
			},
		]);
		expect(result).toEqual([]);
	});

	it("should return empty object when no term tags found in keywords", () => {
		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "rd-teeft",
				},
				value: [
					{
						tag: "keywords",
						value: [
							{
								tag: "notATerm",
								value: [],
							},
						],
					},
				],
			},
		]);
		expect(result).toEqual([]);
	});

	it("should return empty object when terms cannot be extracted", () => {
		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "rd-teeft",
				},
				value: [
					{
						tag: "keywords",
						value: [
							{
								tag: "term",
								value: [], // No index tag with term
							},
						],
					},
				],
			},
		]);
		expect(result).toEqual([]);
	});

	it("should parse teeft enrichment and return terms", () => {
		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "rd-teeft",
				},
				value: [
					{
						tag: "keywords",
						value: [
							{
								tag: "term",
								value: [
									{
										tag: "term",
										value: [
											{
												tag: "#text",
												value: "machine learning",
											},
										],
									},
									{
										tag: "fs",
										attributes: {
											"@type": "statistics",
										},
										value: [
											{
												tag: "f",
												attributes: {
													"@name": "frequency",
												},
												value: [
													{
														tag: "numeric",
														attributes: {
															"@value": "5",
														},
														value: [],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		]);

		expect(result).toEqual([
			{
				term: "machine learning",
				frequency: 5,
				displayed: true,
			},
		]);
	});

	it("should parse multiple terms", () => {
		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "rd-teeft",
				},
				value: [
					{
						tag: "keywords",
						value: [
							{
								tag: "term",
								value: [
									{
										tag: "term",
										value: [
											{
												tag: "#text",
												value: "artificial intelligence",
											},
										],
									},
									{
										tag: "fs",
										attributes: {
											"@type": "statistics",
										},
										value: [
											{
												tag: "f",
												attributes: {
													"@name": "frequency",
												},
												value: [
													{
														tag: "numeric",
														attributes: {
															"@value": "10",
														},
														value: [],
													},
												],
											},
										],
									},
								],
							},
							{
								tag: "term",
								value: [
									{
										tag: "term",
										value: [
											{
												tag: "#text",
												value: "deep learning",
											},
										],
									},
									{
										tag: "fs",
										attributes: {
											"@type": "statistics",
										},
										value: [
											{
												tag: "f",
												attributes: {
													"@name": "frequency",
												},
												value: [
													{
														tag: "numeric",
														attributes: {
															"@value": "3",
														},
														value: [],
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		]);

		expect(result).toEqual([
			{
				term: "artificial intelligence",
				frequency: 10,
				displayed: true,
			},
			{
				term: "deep learning",
				frequency: 3,
				displayed: true,
			},
		]);
	});

	it("should default frequency to 0 when not provided", () => {
		const result = parseTeeft([
			{
				tag: "ns1:listAnnotation",
				attributes: {
					"@type": "rd-teeft",
				},
				value: [
					{
						tag: "keywords",
						value: [
							{
								tag: "term",
								value: [
									{
										tag: "term",
										value: [
											{
												tag: "#text",
												value: "neural network",
											},
										],
									},
								],
							},
						],
					},
				],
			},
		]);

		expect(result).toEqual([
			{
				term: "neural network",
				frequency: 0,
				displayed: true,
			},
		]);
	});

	it("should filter out invalid terms and keep valid ones", () => {
		const result = parseTeeft([
			{ tag: "?xml", value: [] },

			{
				tag: "TEI",
				value: [
					{
						tag: "ns1:standOff",
						value: [
							{
								tag: "teiHeader",
								value: [],
							},
							{
								tag: "ns1:listAnnotation",
								attributes: {
									"@type": "rd-teeft",
								},
								value: [
									{
										tag: "annotationBlock",
										value: [
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [
															{
																tag: "term",
																value: [
																	{
																		tag: "#text",
																		value: "valid term",
																	},
																],
															},
															{
																tag: "fs",
																attributes: {
																	"@type": "statistics",
																},
																value: [
																	{
																		tag: "f",
																		attributes: {
																			"@name": "frequency",
																		},
																		value: [
																			{
																				tag: "numeric",
																				attributes: {
																					"@value": "9",
																				},
																				value: [],
																			},
																		],
																	},
																],
															},
														],
													},
													{
														tag: "term",
														value: [], // Invalid - no term tag
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		]);

		expect(result).toEqual([
			{
				term: "valid term",
				frequency: 9,
				displayed: true,
			},
		]);
	});
});
