import { act } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import type { TermStatistic } from "../../termEnrichment/parseUnitexEnrichment";
import type { EnrichmentTermAnnotationBlockType } from "./enrichmentTermAnnotationBlocks";
import { useListEnrichmentTermAnnotationByBlockType } from "./useListEnrichmentTermAnnotationByBlockType";

const enrichments = {
	date: [{ term: "2021", displayed: true }],
	placeName: [
		{ term: "Paris", displayed: true },
		{ term: "London", displayed: true },
	],
} satisfies Partial<Record<EnrichmentTermAnnotationBlockType, TermStatistic[]>>;

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<DocumentContextProvider
			jsonDocument={[]}
			jsonUnitexEnrichment={enrichments}
		>
			{children}
		</DocumentContextProvider>
	);
}

describe("useListEnrichmentTermAnnotationByBlockType", () => {
	it.each<{ type: EnrichmentTermAnnotationBlockType; terms: TermStatistic[] }>([
		{
			type: "date",
			terms: enrichments.date,
		},
		{
			type: "placeName",
			terms: enrichments.placeName,
		},
	])("should return the correct annotations for $type block type", async ({
		type,
		terms,
	}) => {
		const result = await renderHook(
			() => useListEnrichmentTermAnnotationByBlockType(type),
			{ wrapper: TestWrapper },
		);

		expect(result.result.current.annotations).toEqual(terms);
	});

	it("should return an empty array for a block type with no annotations", async () => {
		const result = await renderHook(
			() => useListEnrichmentTermAnnotationByBlockType("orgName"),
			{ wrapper: TestWrapper },
		);

		expect(result.result.current.annotations).toEqual([]);
	});

	it("should expose a toggleBlock function that calls the context toggleBlock function with the correct parameters", async () => {
		const result = await renderHook(
			() => useListEnrichmentTermAnnotationByBlockType("placeName"),
			{ wrapper: TestWrapper },
		);

		act(() => {
			result.result.current.toggleBlock();
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "Paris", displayed: false },
			{ term: "London", displayed: false },
		]);

		act(() => {
			result.result.current.toggleBlock();
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "Paris", displayed: true },
			{ term: "London", displayed: true },
		]);
	});

	it("should expose a toggleTerm function that calls the context toggleTerm function with the correct parameters", async () => {
		const result = await renderHook(
			() => useListEnrichmentTermAnnotationByBlockType("date"),
			{ wrapper: TestWrapper },
		);

		act(() => {
			result.result.current.toggleTerm("2021");
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "2021", displayed: false },
		]);

		act(() => {
			result.result.current.toggleTerm("2021");
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "2021", displayed: true },
		]);
	});
});
