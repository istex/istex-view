import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentContext,
	type DocumentContextType,
} from "../DocumentContextProvider";
import { useSidePanelEnrichments } from "./useSidePanelEnrichments";

function createDocumentContextWrapper(
	contextValue: Partial<DocumentContextType> = {},
) {
	return {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<DocumentContext.Provider
				value={{
					jsonDocument: [],
					multicatEnrichment: [],
					...contextValue,
				}}
			>
				{children}
			</DocumentContext.Provider>
		),
	};
}

describe("useSidePanelEnrichments", () => {
	describe("enrichmentCount", () => {
		it("should return 0 when no enrichments are present", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: undefined,
				multicatEnrichment: [],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			expect(result.current.enrichmentCount).toBe(0);
		});

		it("should count term enrichment groups with entries", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: {
					document: {},
					termCountByGroup: {
						date: { "2023": 1 },
						persName: { "John Doe": 2 },
						placeName: {},
					},
					toggleBlock: () => {},
					toggleTerm: () => {},
				},
				multicatEnrichment: [],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			// Should count 2 groups (date and persName have entries, placeName is empty)
			expect(result.current.enrichmentCount).toBe(2);
		});

		it("should count multicat enrichments", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: undefined,
				multicatEnrichment: [
					{ scheme: "inist", keywords: [] },
					{ scheme: "wos", keywords: [] },
				],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			expect(result.current.enrichmentCount).toBe(2);
		});

		it("should count both term enrichments and multicat enrichments", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: {
					document: {},
					termCountByGroup: {
						date: { "2023": 1 },
						persName: { "John Doe": 2 },
						orgName: { "ACME Corp": 1 },
					},
					toggleBlock: () => {},
					toggleTerm: () => {},
				},
				multicatEnrichment: [{ scheme: "inist", keywords: [] }],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			// 3 term enrichment groups + 1 multicat = 4
			expect(result.current.enrichmentCount).toBe(4);
		});
	});

	describe("openEnrichment", () => {
		it("should return undefined when no enrichments are present", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: undefined,
				multicatEnrichment: [],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			expect(result.current.openEnrichment).toBeUndefined();
		});

		it("should return the first term enrichment section with data", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: {
					document: {},
					termCountByGroup: {
						date: { "2023": 1 },
						persName: { "John Doe": 2 },
					},
					toggleBlock: () => {},
					toggleTerm: () => {},
				},
				multicatEnrichment: [],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			expect(result.current.openEnrichment).toBe("termEnrichment_date");
		});

		it("should return the first multicat section when no term enrichments have data", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: {
					document: {},
					termCountByGroup: {},
					toggleBlock: () => {},
					toggleTerm: () => {},
				},
				multicatEnrichment: [
					{ scheme: "wos", keywords: [] },
					{ scheme: "inist", keywords: [] },
				],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			expect(result.current.openEnrichment).toBe("multicat_inist");
		});

		it("should prioritize term enrichments over multicat", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: {
					document: {},
					termCountByGroup: {
						persName: { "John Doe": 2 },
					},
					toggleBlock: () => {},
					toggleTerm: () => {},
				},
				multicatEnrichment: [{ scheme: "inist", keywords: [] }],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			expect(result.current.openEnrichment).toBe("termEnrichment_persName");
		});

		it("should return undefined when all term enrichment groups are empty", async () => {
			const { wrapper } = createDocumentContextWrapper({
				termEnrichment: {
					document: {},
					termCountByGroup: {
						date: {},
						persName: {},
					},
					toggleBlock: () => {},
					toggleTerm: () => {},
				},
				multicatEnrichment: [],
			});

			const { result } = await renderHook(() => useSidePanelEnrichments(), {
				wrapper,
			});

			expect(result.current.openEnrichment).toBeUndefined();
		});
	});
});
