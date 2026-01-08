import { describe, expect, it, vi } from "vitest";
import {
	exractTermFromAnnotationBlock,
	getAnnotationFrequency,
	getAnnotationTerm,
	parseUnitexEnrichment,
} from "./parseUnitexEnrichment";

describe("parseUnitexEnrichment", () => {
	describe("getAnnotationTerm", () => {
		it("should return the term text when term tag is present", () => {
			const result = getAnnotationTerm({
				tag: "annotation",
				value: [
					{
						tag: "term",
						value: [
							{
								tag: "#text",
								value: "exampleTerm",
							},
						],
					},
				],
			});

			expect(result).toBe("exampleTerm");
		});

		it("should return deeply nested term text", () => {
			const result = getAnnotationTerm({
				tag: "annotationBlock",
				value: [
					{
						tag: "persName",
						value: [
							{
								tag: "term",
								value: [
									{
										tag: "#text",
										value: "nestedTerm",
									},
								],
							},
						],
					},
				],
			});

			expect(result).toBe("nestedTerm");
		});

		it("should return null when term tag is absent", () => {
			const result = getAnnotationTerm({
				tag: "annotation",
				value: [
					{
						tag: "otherTag",
						value: [
							{
								tag: "#text",
								value: "noTermHere",
							},
						],
					},
				],
			});

			expect(result).toBeNull();
		});
	});

	describe("getAnnotationFrequency", () => {
		it("should return the frequency number when present", () => {
			const result = getAnnotationFrequency({
				tag: "annotation",
				value: [
					{
						tag: "fs",
						attributes: { "@type": "statistics" },
						value: [
							{
								tag: "f",
								attributes: { "@name": "frequency" },
								value: [
									{
										tag: "numeric",
										attributes: { "@value": "42" },
										value: [],
									},
								],
							},
						],
					},
				],
			});

			expect(result).toBe(42);
		});

		it("should return null when fs tag has wrong type", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const result = getAnnotationFrequency({
				tag: "annotation",
				value: [
					{
						tag: "fs",
						attributes: { "@type": "otherType" },
						value: [],
					},
				],
			});

			expect(result).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"No fs[type=statistics] tag found in annotationBlock",
				{
					tag: "annotation",
					value: [
						{
							tag: "fs",
							attributes: { "@type": "otherType" },
							value: [],
						},
					],
				},
			);
			consoleWarnSpy.mockRestore();
		});

		it("should return null and warn when fs tag is missing", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const result = getAnnotationFrequency({
				tag: "annotation",
				value: [],
			});

			expect(result).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"No fs[type=statistics] tag found in annotationBlock",
				{
					tag: "annotation",
					value: [],
				},
			);
			consoleWarnSpy.mockRestore();
		});

		it("should return null and warn when frequency f tag is missing", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const result = getAnnotationFrequency({
				tag: "annotation",
				value: [
					{
						tag: "fs",
						attributes: { "@type": "statistics" },
						value: [],
					},
				],
			});

			expect(result).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"No f[name=frequency] tag found in fs statistics",
				{
					tag: "fs",
					attributes: { "@type": "statistics" },
					value: [],
				},
			);
			consoleWarnSpy.mockRestore();
		});

		it("should return null and warn when numeric tag is missing", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const result = getAnnotationFrequency({
				tag: "annotation",
				value: [
					{
						tag: "fs",
						attributes: { "@type": "statistics" },
						value: [
							{
								tag: "f",
								attributes: { "@name": "frequency" },
								value: [],
							},
						],
					},
				],
			});

			expect(result).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"No numeric tag found in f frequency",
				{
					tag: "f",
					attributes: { "@name": "frequency" },
					value: [],
				},
			);
			consoleWarnSpy.mockRestore();
		});

		it("should return null and warn for invalid frequency value", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const result = getAnnotationFrequency({
				tag: "annotation",
				value: [
					{
						tag: "fs",
						attributes: { "@type": "statistics" },
						value: [
							{
								tag: "f",
								attributes: { "@name": "frequency" },
								value: [
									{
										tag: "numeric",
										attributes: { "@value": "invalidNumber" },
										value: [],
									},
								],
							},
						],
					},
				],
			});

			expect(result).toBeNull();
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"Invalid frequency value in numeric tag",
				{
					tag: "numeric",
					attributes: { "@value": "invalidNumber" },
					value: [],
				},
			);
			consoleWarnSpy.mockRestore();
		});
	});

	describe("exractTermFromAnnotationBlock", () => {
		it("should return TermStatistic when term and frequency are present", () => {
			const result = exractTermFromAnnotationBlock({
				tag: "annotation",
				value: [
					{
						tag: "term",
						value: [
							{
								tag: "#text",
								value: "exampleTerm",
							},
						],
					},
					{
						tag: "fs",
						attributes: { "@type": "statistics" },
						value: [
							{
								tag: "f",
								attributes: { "@name": "frequency" },
								value: [
									{
										tag: "numeric",
										attributes: { "@value": "10" },
										value: [],
									},
								],
							},
						],
					},
				],
			});

			expect(result).toEqual({
				term: "exampleTerm",
				frequency: 10,
				displayed: true,
			});
		});

		it("should return null when term is missing", () => {
			const result = exractTermFromAnnotationBlock({
				tag: "annotation",
				value: [
					{
						tag: "fs",
						attributes: { "@type": "statistics" },
						value: [
							{
								tag: "f",
								attributes: { "@name": "frequency" },
								value: [
									{
										tag: "numeric",
										attributes: { "@value": "10" },
										value: [],
									},
								],
							},
						],
					},
				],
			});

			expect(result).toBeNull();
		});
	});

	it("should return all terms statistic grouped by their type", () => {
		const result = parseUnitexEnrichment([
			{
				tag: "?xml",
				value: [],
			},
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
									"@type": "person",
								},
								value: [
									{
										tag: "annotationBlock",
										value: [
											{
												tag: "term",
												value: [
													{
														tag: "#text",
														value: "John Doe",
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
									{
										tag: "annotationBlock",
										value: [
											{
												tag: "term",
												value: [
													{
														tag: "#text",
														value: "Jane Smith",
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

							{
								tag: "ns1:listAnnotation",
								attributes: {
									"@type": "location",
								},
								value: [
									{
										tag: "annotationBlock",
										value: [
											{
												tag: "term",
												value: [
													{
														tag: "#text",
														value: "New York",
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
																	"@value": "8",
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
										tag: "annotationBlock",
										value: [
											{
												tag: "term",
												value: [
													{
														tag: "#text",
														value: "Los Angeles",
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
																	"@value": "4",
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

							{
								tag: "ns1:listAnnotation",
								attributes: {
									"@type": "date",
								},
								value: [
									{
										tag: "annotationBlock",
										value: [
											{
												tag: "date",
												value: [
													{
														tag: "term",
														value: [
															{
																tag: "#text",
																value: "2023-01-01",
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
																			"@value": "12",
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
						],
					},
				],
			},
		]);

		expect(result).toEqual({
			person: [
				{ term: "John Doe", frequency: 5, displayed: true },
				{ term: "Jane Smith", frequency: 3, displayed: true },
			],
			location: [
				{ term: "New York", frequency: 8, displayed: true },
				{ term: "Los Angeles", frequency: 4, displayed: true },
			],
			date: [{ term: "2023-01-01", frequency: 12, displayed: true }],
		});
	});
});
