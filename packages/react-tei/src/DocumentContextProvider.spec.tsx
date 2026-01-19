import { act } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentContextProvider,
	initialPanelState,
	useDocumentContext,
} from "./DocumentContextProvider";
import type { EnrichmentTermAnnotationBlockType } from "./SidePanel/enrichmentTerm/enrichmentTermAnnotationBlocks";
import type { TermStatistic } from "./unitex/parseUnitexEnrichment";

describe("DocumentContextProvider", () => {
	describe("panel", () => {
		it("should initialize panel state with isOpen true and authors section open", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			});

			expect(result.current.panel.state).toStrictEqual(initialPanelState);
		});

		it("should expose togglePanel function to toggle panelState.isOpen", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			});

			expect(result.current.panel).toHaveProperty("togglePanel");

			expect(result.current.panel.state).toStrictEqual(initialPanelState);
			act(() => {
				result.current.panel.togglePanel();
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: false,
				sections: initialPanelState.sections,
			});
			act(() => {
				result.current.panel.togglePanel();
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: initialPanelState.sections,
			});
		});

		it("should keep sections state unchanged when toggling panel", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			});

			act(() => {
				result.current.panel.toggleSection("authors");
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: {
					...initialPanelState.sections,
					authors: false,
				},
			});

			act(() => {
				result.current.panel.togglePanel();
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: false,
				sections: {
					...initialPanelState.sections,
					authors: false,
				},
			});
		});

		it("should expose toggleSection function in the context", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			});

			expect(result.current.panel).toHaveProperty("toggleSection");

			expect(result.current.panel.state).toStrictEqual(initialPanelState);
			act(() => {
				result.current.panel.toggleSection("authors");
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: {
					...initialPanelState.sections,
					authors: false,
				},
			});
		});

		it("should open the panel when toggling a section from closed to open", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			});

			// First, close the panel
			act(() => {
				result.current.panel.togglePanel();
			});

			act(() => {
				result.current.panel.toggleSection("authors");
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: false,
				sections: {
					...initialPanelState.sections,
					authors: false,
				},
			});

			// Now, toggle the 'authors' section (which is currently open)
			act(() => {
				result.current.panel.toggleSection("authors");
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: {
					...initialPanelState.sections,
					authors: true,
				},
			});
		});

		it("should not update the panel isOpen when toggling a section from open to closed", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			});

			act(() => {
				result.current.panel.togglePanel();
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: false,
				sections: initialPanelState.sections,
			});

			act(() => {
				result.current.panel.toggleSection("authors");
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: false,
				sections: {
					...initialPanelState.sections,
					authors: false,
				},
			});
		});
	});

	describe("termEnrichment", () => {
		const enrichments = {
			date: [{ term: "2021", frequency: 3, displayed: true }],
			placeName: [
				{ term: "Paris", frequency: 2, displayed: true },
				{ term: "London", frequency: 1, displayed: true },
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
