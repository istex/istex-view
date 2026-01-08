import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";
import type { UnitexAnnotationBlockType } from "./unitexAnnotationBlocks";
import { useListUnitexAnnotationByBlockType } from "./useListUnitexAnnotationByBlockType";

const enrichments = {
	date: [{ term: "2021", frequency: 3, displayed: true }],
	placeName: [
		{ term: "Paris", frequency: 2, displayed: true },
		{ term: "London", frequency: 1, displayed: true },
	],
} satisfies Partial<Record<UnitexAnnotationBlockType, TermStatistic[]>>;

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

describe("useListUnitexAnnotationByBlockType", () => {
	it.each<{ type: UnitexAnnotationBlockType; terms: TermStatistic[] }>([
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
			() => useListUnitexAnnotationByBlockType(type),
			{ wrapper: TestWrapper },
		);

		expect(result.result.current).toEqual(terms);
	});

	it("should return an empty array for a block type with no annotations", async () => {
		const result = await renderHook(
			() => useListUnitexAnnotationByBlockType("orgName"),
			{ wrapper: TestWrapper },
		);

		expect(result.result.current).toEqual([]);
	});
});
