import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useUnitexEnrichmentParser } from "./useUnitexEnrichmentParser";

describe("useUnitexEnrichmentParser", () => {
	it("should parse unitext enrichment xml", async () => {
		const result = await renderHook(() =>
			useUnitexEnrichmentParser(`<?xml version="1.0" encoding="UTF-8"?>
                <TEI>
                    <ns1:standOff>
                        <teiHeader>
                        </teiHeader>
                        <ns1:listAnnotation type="date">
                            <annotationBlock>
                                <date>
                                    <term>2023</term>
                                    <fs type="statistics">
                                        <f name="frequency">
                                            <numeric value="5"/>
                                        </f>
                                    </fs>
                                </date>
                            </annotationBlock>
                            <annotationBlock>
                                <date>
                                    <term>2024</term>
                                    <fs type="statistics">
                                        <f name="frequency">
                                            <numeric value="2"/>
                                        </f>
                                    </fs>
                                </date>
                            </annotationBlock>
                        </ns1:listAnnotation>
                        <ns1:listAnnotation type="person">
                            <annotationBlock>
                                <persName>
                                    <term>John Doe</term>
                                    <fs type="statistics">
                                        <f name="frequency">
                                            <numeric value="10"/>
                                        </f>
                                    </fs>
                                </persName>
                            </annotationBlock>
                            <annotationBlock>
                                <persName>
                                    <term>Jane Smith</term>
                                    <fs type="statistics">
                                        <f name="frequency">
                                            <numeric value="7"/>
                                        </f>
                                    </fs>
                                </persName>
                            </annotationBlock>
                        </ns1:listAnnotation>
                        <ns1:listAnnotation type="orgName">
                            <annotationBlock>
                                <orgName>
                                    <term>Acme Corp</term>
                                    <fs type="statistics">
                                        <f name="frequency">
                                            <numeric value="3"/>
                                        </f>
                                    </fs>
                                </orgName>
                            </annotationBlock>
                        </ns1:listAnnotation>
                    </ns1:standOff>
                </TEI>
    <ns1:standOff>
    `),
		);

		expect(result.result.current).toEqual({
			date: [
				{ term: "2023", frequency: 5, displayed: true },
				{ term: "2024", frequency: 2, displayed: true },
			],
			person: [
				{ term: "John Doe", frequency: 10, displayed: true },
				{ term: "Jane Smith", frequency: 7, displayed: true },
			],
			orgName: [{ term: "Acme Corp", frequency: 3, displayed: true }],
		});
	});

	it("should return empty object if no unitex enrichment provided", async () => {
		const result = await renderHook(() => useUnitexEnrichmentParser(undefined));

		expect(result.result.current).toEqual({});
	});

	it("should return empty object if no matching tags found", async () => {
		const result = await renderHook(() =>
			useUnitexEnrichmentParser(`<?xml version="1.0" encoding="UTF-8"?>
                <TEI>
                    <teiHeader>
                    </teiHeader>
                </TEI>
    `),
		);
		expect(result.result.current).toEqual({});
	});
});
