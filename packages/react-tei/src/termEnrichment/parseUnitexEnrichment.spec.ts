import { describe, expect, it } from "vitest";
import {
	exractTermFromAnnotationBlock,
	getAnnotationTerm,
	getListAnnotationType,
	parseUnitexEnrichment,
} from "./parseUnitexEnrichment";

describe("parseUnitexEnrichment", () => {
	describe("getListAnnotationType", () => {
		it("should return correct type for orgName with funder subtype", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "orgName",
					"@subtype": "funder",
				},
				value: [],
			});

			expect(result).toBe("orgNameFunder");
		});

		it("should return correct type for orgName with provider subtype", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "orgName",
					"@subtype": "provider",
				},
				value: [],
			});

			expect(result).toBe("orgNameProvider");
		});

		it("should return orgName for orgName without subtype", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "orgName",
				},
				value: [],
			});

			expect(result).toBe("orgName");
		});

		it("should return null for other type un changed", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "otherType",
				},
				value: [],
			});

			expect(result).toBe("otherType");
		});

		it("should return null for ref with unknown subtype", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "ref",
					"@subtype": "unknownSubtype",
				},
				value: [],
			});

			expect(result).toBeNull();
		});

		it("should return refBibl for ref with bibl subtype", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "ref",
					"@subtype": "bibl",
				},
				value: [],
			});

			expect(result).toBe("refBibl");
		});

		it("should return refUrl for ref with url subtype", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "ref",
					"@subtype": "url",
				},
				value: [],
			});

			expect(result).toBe("refUrl");
		});

		it("should return null when @type attribute is ref and there is no subtype", () => {
			const result = getListAnnotationType({
				tag: "listAnnotation",
				attributes: {
					"@type": "ref",
				},
				value: [],
			});

			expect(result).toBeNull();
		});
	});

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
				{ term: "John Doe", displayed: true },
				{ term: "Jane Smith", displayed: true },
			],
			location: [
				{ term: "New York", displayed: true },
				{ term: "Los Angeles", displayed: true },
			],
			date: [{ term: "2023-01-01", displayed: true }],
		});
	});
});
