import { act } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentContextProvider,
	useDocumentContext,
} from "./DocumentContextProvider";
import type { EnrichmentTermAnnotationBlockType } from "./SidePanel/enrichmentTerm/enrichmentTermAnnotationBlocks";
import type { TermStatistic } from "./termEnrichment/parseUnitexEnrichment";

describe("DocumentContextProvider", () => {
	describe("termEnrichment", () => {
		const enrichments = {
			date: [{ term: "2021", displayed: true }],
			placeName: [
				{ term: "Paris", displayed: true },
				{ term: "London", displayed: true },
			],
		} satisfies Partial<
			Record<EnrichmentTermAnnotationBlockType, TermStatistic[]>
		>;

		const Wrapper = ({ children }: { children: React.ReactNode }) => (
			<DocumentContextProvider
				jsonDocument={[]}
				jsonUnitexEnrichment={enrichments}
			>
				{children}
			</DocumentContextProvider>
		);

		it("should be undefined if no unitex document is provided", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper({ children }: { children: React.ReactNode }) {
					return (
						<DocumentContextProvider jsonDocument={[]}>
							{children}
						</DocumentContextProvider>
					);
				},
			});

			expect(result.current.termEnrichment).toBeUndefined();
		});

		it("should contain the unitex document if provided", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: Wrapper,
			});

			expect(result.current.termEnrichment?.document).toStrictEqual({
				...enrichments,
				teeft: undefined,
			});
		});

		it('should expose toggleBlock function that updates the "displayed" property of all terms in the block', async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: Wrapper,
			});

			expect(
				result.current.termEnrichment?.document.placeName?.every(
					(annotation) => annotation.displayed,
				),
			).toBe(true);

			act(() => {
				result.current.termEnrichment?.toggleBlock("placeName");
			});

			expect(
				result.current.termEnrichment?.document.placeName?.every(
					(annotation) => !annotation.displayed,
				),
			).toBe(true);

			act(() => {
				result.current.termEnrichment?.toggleBlock("placeName");
			});

			expect(
				result.current.termEnrichment?.document.placeName?.every(
					(annotation) => annotation.displayed,
				),
			).toBe(true);
		});

		it("should display all terms when toggling a block with some hidden terms", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: Wrapper,
			});

			// First, hide one term
			act(() => {
				result.current.termEnrichment?.toggleTerm("placeName", "London");
			});

			expect(
				result.current.termEnrichment?.document.placeName?.find(
					(annotation) => annotation.term === "London",
				)?.displayed,
			).toBe(false);

			// Now, toggle the block
			act(() => {
				result.current.termEnrichment?.toggleBlock("placeName");
			});

			// All terms should be displayed
			expect(
				result.current.termEnrichment?.document.placeName?.every(
					(annotation) => annotation.displayed,
				),
			).toBe(true);
		});

		it('should expose toggleTerm function that updates the "displayed" property of the term', async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: Wrapper,
			});

			expect(result.current.termEnrichment?.document.date?.[0]?.displayed).toBe(
				true,
			);

			act(() => {
				result.current.termEnrichment?.toggleTerm("date", "2021");
			});

			expect(result.current.termEnrichment?.document.date?.[0]?.displayed).toBe(
				false,
			);

			act(() => {
				result.current.termEnrichment?.toggleTerm("date", "2021");
			});

			expect(result.current.termEnrichment?.document.date?.[0]?.displayed).toBe(
				true,
			);
		});
	});
});

describe("useDocumentContext", () => {
	it("should throw an error when used outside of DocumentContextProvider", async () => {
		await expect(() =>
			renderHook(() => useDocumentContext()),
		).rejects.toThrowError(
			"useDocumentContext must be used within a DocumentContextProvider",
		);
	});
});
