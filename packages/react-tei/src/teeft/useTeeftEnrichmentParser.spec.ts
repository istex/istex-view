import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { useTeeftEnrichmentParser } from "./useTeeftEnrichmentParser";

describe("useTeeftEnrichmentParser", () => {
	it("should parse teeft enrichment xml", async () => {
		const result = await renderHook(() =>
			useTeeftEnrichmentParser(`<?xml version="1.0" encoding="UTF-8"?>
                <TEI>
                    <ns1:standOff>
                        <teiHeader>
                        </teiHeader>
                        <ns1:listAnnotation type="rd-teeft">
                            <annotationBlock>
                                <keywords>
                                    <term>
                                        <term>machine learning</term>
                                        <fs type="statistics">
                                            <f name="frequency">
                                                <numeric value="5"/>
                                            </f>
                                        </fs>
                                    </term>
                                    <term>
                                        <term>artificial intelligence</term>
                                        <fs type="statistics">
                                            <f name="frequency">
                                                <numeric value="10"/>
                                            </f>
                                        </fs>
                                    </term>
                                </keywords>
                            </annotationBlock>
                        </ns1:listAnnotation>
                    </ns1:standOff>
                </TEI>
    `),
		);

		expect(result.result.current).toEqual([
			{ term: "machine learning", frequency: 5, displayed: true },
			{ term: "artificial intelligence", frequency: 10, displayed: true },
		]);
	});

	it("should return empty object if no teeft enrichment provided", async () => {
		const result = await renderHook(() => useTeeftEnrichmentParser(undefined));

		expect(result.result.current).toEqual([]);
	});

	it("should return empty object if no matching tags found", async () => {
		const result = await renderHook(() =>
			useTeeftEnrichmentParser(`<?xml version="1.0" encoding="UTF-8"?>
                <TEI>
                    <teiHeader>
                    </teiHeader>
                </TEI>
    `),
		);
		expect(result.result.current).toEqual([]);
	});

	it("should return empty object if listAnnotation type is not rd-teeft", async () => {
		const result = await renderHook(() =>
			useTeeftEnrichmentParser(`<?xml version="1.0" encoding="UTF-8"?>
                <TEI>
                    <ns1:standOff>
                        <ns1:listAnnotation type="other-type">
                            <annotationBlock>
                                <keywords>
                                    <term>
                                        <term>some term</term>
                                    </term>
                                </keywords>
                            </annotationBlock>
                        </ns1:listAnnotation>
                    </ns1:standOff>
                </TEI>
    `),
		);
		expect(result.result.current).toEqual([]);
	});

	it("should default frequency to 0 when not provided", async () => {
		const result = await renderHook(() =>
			useTeeftEnrichmentParser(`<?xml version="1.0" encoding="UTF-8"?>
                <TEI>
                    <ns1:standOff>
                        <ns1:listAnnotation type="rd-teeft">
                            <annotationBlock>
                                <keywords>
                                    <term>
                                        <term>neural network</term>
                                    </term>
                                </keywords>
                            </annotationBlock>
                        </ns1:listAnnotation>
                    </ns1:standOff>
                </TEI>
    `),
		);

		expect(result.result.current).toEqual([
			{ term: "neural network", frequency: 0, displayed: true },
		]);
	});
});
