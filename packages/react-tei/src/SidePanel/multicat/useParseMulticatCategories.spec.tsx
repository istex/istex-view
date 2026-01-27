import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import {
	type MulticatCategory,
	mergeCategoriesByScheme,
	parseMulticatKeywords,
	parseMulticatScheme,
	useParseMulticatCategories,
} from "./useParseMulticatCategories";

describe("parseMulticatKeywords", () => {
	it("should return an empty array if keywords array is empty", () => {
		const keywords: DocumentJson[] = [];
		expect(parseMulticatKeywords(keywords)).toStrictEqual([]);
	});

	it("should return a tree structure of keywords", () => {
		const keywords: DocumentJson[] = [
			{
				tag: "term",
				attributes: { "@level": "1" },
				value: [
					{
						tag: "#text",
						value: "Keyword 1",
					},
				],
			},
			{
				tag: "term",
				attributes: { "@level": "2" },
				value: [
					{
						tag: "#text",
						value: "Keyword 1.1",
					},
				],
			},
			{
				tag: "term",
				attributes: { "@level": "2" },
				value: [
					{
						tag: "#text",
						value: "Keyword 1.2",
					},
				],
			},
			{
				tag: "term",
				attributes: { "@level": "1" },
				value: [
					{
						tag: "#text",
						value: "Keyword 2",
					},
				],
			},
		];

		expect(parseMulticatKeywords(keywords)).toStrictEqual([
			{
				level: 1,
				keyword: [
					{
						tag: "#text",
						value: "Keyword 1",
					},
				],
				children: [
					{
						level: 2,
						keyword: [
							{
								tag: "#text",
								value: "Keyword 1.1",
							},
						],
						children: [],
					},
					{
						level: 2,
						keyword: [
							{
								tag: "#text",
								value: "Keyword 1.2",
							},
						],
						children: [],
					},
				],
			},
			{
				level: 1,
				keyword: [
					{
						tag: "#text",
						value: "Keyword 2",
					},
				],
				children: [],
			},
		]);
	});
});

describe("parseMulticatScheme", () => {
	it('should support scheme starting with "#"', () => {
		expect(parseMulticatScheme("#wos")).toBe("wos");
		expect(parseMulticatScheme("#science-metrix")).toBe("science_metrix");
		expect(parseMulticatScheme("#scopus")).toBe("scopus");
	});

	it('should support inist scheme"', () => {
		expect(parseMulticatScheme("https://inist-category.data.istex.fr")).toBe(
			"inist",
		);
	});
});

describe("mergeCategoriesByScheme", () => {
	it("should not merge categories with different schemes", () => {
		const categories: MulticatCategory[] = [
			{
				scheme: "wos",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "science",
							},
						],
						children: [],
					},
				],
			},
			{
				scheme: "science_metrix",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "science",
							},
						],
						children: [],
					},
				],
			},
		];

		expect(mergeCategoriesByScheme(categories)).toStrictEqual(categories);
	});

	it("should merge categories with the same scheme", () => {
		const categories: MulticatCategory[] = [
			{
				scheme: "wos",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "science",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "physics, multidisciplinary",
									},
								],
								children: [],
							},
						],
					},
				],
			},
			{
				scheme: "wos",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "science",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "chemistry, multidisciplinary",
									},
								],
								children: [],
							},
						],
					},
				],
			},
		];

		expect(mergeCategoriesByScheme(categories)).toStrictEqual([
			{
				scheme: "wos",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "science",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "physics, multidisciplinary",
									},
								],
								children: [],
							},
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "chemistry, multidisciplinary",
									},
								],
								children: [],
							},
						],
					},
				],
			},
		]);
	});

	it("should support multiple level 1 keywords under the same scheme", () => {
		const categories: MulticatCategory[] = [
			{
				scheme: "scopus",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "Engineering and Technology",
							},
						],
						children: [],
					},
				],
			},
			{
				scheme: "scopus",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "Scopus: Physical Sciences",
							},
						],
						children: [],
					},
				],
			},
		];

		expect(mergeCategoriesByScheme(categories)).toStrictEqual([
			{
				scheme: "scopus",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "Engineering and Technology",
							},
						],
						children: [],
					},
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "Scopus: Physical Sciences",
							},
						],
						children: [],
					},
				],
			},
		]);
	});
});

describe("useParseMulticatCategories", () => {
	it("should return an empty array when document is null", async () => {
		const result = await renderHook(() => useParseMulticatCategories(null));

		expect(result.result.current).toStrictEqual([]);
	});

	it("should parse a multicat document", async () => {
		const multicatDocument = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Fichier générée le 06-05-2025 -->
<!-- multicat - v1.0.12 - sm-wos-scopus -->
<TEI xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.tei-c.org/ns/1.0"
	xsi:noNamespaceSchemaLocation="https://xml-schema.delivery.istex.fr/formats/tei-istex.xsd"
	xmlns:ns1="https://xml-schema.delivery.istex.fr/formats/ns1.xsd">
  <ns1:standOff>
    <teiHeader>
    </teiHeader>
    <ns1:listAnnotation type="rd-multicat">
      <annotationBlock xmls="https//www.tei-c.org/ns/1.0">
        <keywords change="#rd-multicat" resp="#istex" scheme="#wos">
          <term level="1">science</term>
          <term level="2">physics, multidisciplinary</term>
        </keywords>
        <keywords change="#rd-multicat" resp="#istex" scheme="#science-metrix">
          <term level="1">natural sciences</term>
          <term level="2">physics &amp; astronomy</term>
          <term level="3">nuclear &amp; particles physics</term>
        </keywords>
      </annotationBlock>
    </ns1:listAnnotation>
  </ns1:standOff>
</TEI>`;

		const result = await renderHook(() =>
			useParseMulticatCategories(multicatDocument),
		);

		expect(result.result.current).toStrictEqual([
			{
				scheme: "wos",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "science",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "physics, multidisciplinary",
									},
								],
								children: [],
							},
						],
					},
				],
			},
			{
				scheme: "science_metrix",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "natural sciences",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "physics & astronomy",
									},
								],
								children: [
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "nuclear & particles physics",
											},
										],
										children: [],
									},
								],
							},
						],
					},
				],
			},
		]);
	});

	it("should parse a nb document", async () => {
		const document = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Fichier générée le 06-05-2025 -->
<!-- nb - v1.1.2 - pascal-francis -->
<TEI xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.tei-c.org/ns/1.0"
	xsi:noNamespaceSchemaLocation="https://xml-schema.delivery.istex.fr/formats/tei-istex.xsd"
	xmlns:ns1="https://xml-schema.delivery.istex.fr/formats/ns1.xsd">
  <ns1:standOff>
    <teiHeader>
    </teiHeader>
    <ns1:listAnnotation type="rd-nb">
      <annotationBlock corresp="abstract">
        <keywords change="#rd-nb" resp="#istex" scheme="https://inist-category.data.istex.fr">
          <term cert="0.7932669031481164" key="STM" level="1">sciences appliquees, technologies et medecines</term>
          <term cert="0.5403761308159519" key="001" level="2">sciences exactes et technologie</term>
          <term cert="0.1842950350882644" key="001B" level="3">physique</term>
          <term cert="0.23055958378032354" key="001B70" level="4">etat condense: structure electronique, proprietes electriques, magnetiques et optiques</term>
        </keywords>
      </annotationBlock>
    </ns1:listAnnotation>
  </ns1:standOff>
</TEI>`;

		const result = await renderHook(() => useParseMulticatCategories(document));

		expect(result.result.current).toStrictEqual([
			{
				scheme: "inist",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "sciences appliquees, technologies et medecines",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "sciences exactes et technologie",
									},
								],
								children: [
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "physique",
											},
										],
										children: [
											{
												level: 4,
												keyword: [
													{
														tag: "#text",
														value:
															"etat condense: structure electronique, proprietes electriques, magnetiques et optiques",
													},
												],
												children: [],
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
	});

	it("should merge categories with same scheme", async () => {
		const document = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Fichier générée le 06-05-2025 -->
<!-- multicat - v1.0.12 - sm-wos-scopus -->
<TEI xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.tei-c.org/ns/1.0"
	xsi:noNamespaceSchemaLocation="https://xml-schema.delivery.istex.fr/formats/tei-istex.xsd"
	xmlns:ns1="https://xml-schema.delivery.istex.fr/formats/ns1.xsd">
  <ns1:standOff>
    <teiHeader>
    </teiHeader>
    <ns1:listAnnotation type="rd-multicat">
      <annotationBlock xmls="https//www.tei-c.org/ns/1.0">
        <keywords change="#rd-multicat" resp="#istex" scheme="#scopus">
          <term level="1">Scopus: Physical Sciences</term>
          <term level="2">Earth and Planetary Sciences</term>
		  <term level="3">Space and Planetary Science</term>
        </keywords>
        <keywords change="#rd-multicat" resp="#istex" scheme="#scopus">
          <term level="1">Scopus: Physical Sciences</term>
          <term level="2">Earth and Planetary Sciences</term>
		  <term level="3">Earth and Planetary Sciences (miscellaneous)</term>
        </keywords>
        <keywords change="#rd-multicat" resp="#istex" scheme="#scopus">
          <term level="1">Scopus: Physical Sciences</term>
          <term level="2">Earth and Planetary Sciences</term>
		  <term level="3">Atmospheric Science</term>
        </keywords>
        <keywords change="#rd-multicat" resp="#istex" scheme="#scopus">
          <term level="1">Scopus: Physical Sciences</term>
          <term level="2">Earth and Planetary Sciences</term>
		  <term level="3">Geology</term>
        </keywords>
        <keywords change="#rd-multicat" resp="#istex" scheme="#scopus">
          <term level="1">Scopus: Physical Sciences</term>
          <term level="2">Physics and Astronomy</term>
		  <term level="3">Astronomy and Astrophysics</term>
        </keywords>
        <keywords change="#rd-multicat" resp="#istex" scheme="#scopus">
          <term level="1">Engineering and Technology</term>
          <term level="2">Engineering - Mechanical, Aeronautical and Manufacturing</term>
		  <term level="3">Aerospace Engineering</term>
        </keywords>
      </annotationBlock>
    </ns1:listAnnotation>
  </ns1:standOff>
</TEI>`;

		const result = await renderHook(() => useParseMulticatCategories(document));

		expect(result.result.current).toStrictEqual([
			{
				scheme: "scopus",
				keywords: [
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "Scopus: Physical Sciences",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "Earth and Planetary Sciences",
									},
								],
								children: [
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "Space and Planetary Science",
											},
										],
										children: [],
									},
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "Earth and Planetary Sciences (miscellaneous)",
											},
										],
										children: [],
									},
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "Atmospheric Science",
											},
										],
										children: [],
									},
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "Geology",
											},
										],
										children: [],
									},
								],
							},
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value: "Physics and Astronomy",
									},
								],
								children: [
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "Astronomy and Astrophysics",
											},
										],
										children: [],
									},
								],
							},
						],
					},
					{
						level: 1,
						keyword: [
							{
								tag: "#text",
								value: "Engineering and Technology",
							},
						],
						children: [
							{
								level: 2,
								keyword: [
									{
										tag: "#text",
										value:
											"Engineering - Mechanical, Aeronautical and Manufacturing",
									},
								],
								children: [
									{
										level: 3,
										keyword: [
											{
												tag: "#text",
												value: "Aerospace Engineering",
											},
										],
										children: [],
									},
								],
							},
						],
					},
				],
			},
		]);
	});
});
