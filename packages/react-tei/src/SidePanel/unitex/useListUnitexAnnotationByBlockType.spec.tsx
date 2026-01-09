import { act } from "react";
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

		expect(result.result.current.annotations).toEqual(terms);
	});

	it("should return an empty array for a block type with no annotations", async () => {
		const result = await renderHook(
			() => useListUnitexAnnotationByBlockType("orgName"),
			{ wrapper: TestWrapper },
		);

		expect(result.result.current.annotations).toEqual([]);
	});

	it("should expose a toggleBlock function that calls the context toggleBlock function with the correct parameters", async () => {
		const result = await renderHook(
			() => useListUnitexAnnotationByBlockType("placeName"),
			{ wrapper: TestWrapper },
		);

		act(() => {
			result.result.current.toggleBlock();
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "Paris", frequency: 2, displayed: false },
			{ term: "London", frequency: 1, displayed: false },
		]);

		act(() => {
			result.result.current.toggleBlock();
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "Paris", frequency: 2, displayed: true },
			{ term: "London", frequency: 1, displayed: true },
		]);
	});

	it("should expose a toggleTerm function that calls the context toggleTerm function with the correct parameters", async () => {
		const result = await renderHook(
			() => useListUnitexAnnotationByBlockType("date"),
			{ wrapper: TestWrapper },
		);

		act(() => {
			result.result.current.toggleTerm("2021");
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "2021", frequency: 3, displayed: false },
		]);

		act(() => {
			result.result.current.toggleTerm("2021");
		});

		expect(result.result.current.annotations).toEqual([
			{ term: "2021", frequency: 3, displayed: true },
		]);
	});
});
