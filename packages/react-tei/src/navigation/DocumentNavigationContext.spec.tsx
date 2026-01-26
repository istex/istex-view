import { act, type RefObject } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentSidePanelContext,
	DocumentSidePanelContextProvider,
	type DocumentSidePanelContextType,
} from "../SidePanel/DocumentSidePanelContext";
import { DocumentNavigationContextProvider } from "./DocumentNavigationContext";
import { useDocumentNavigation } from "./useNavigateToSection";

function createDocumentWrapper() {
	const tocElement = document.createElement("div");
	const sidePaneElement = document.createElement("div");

	return {
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<DocumentSidePanelContextProvider>
				<DocumentNavigationContextProvider
					tocRef={
						{
							current: tocElement,
						} as unknown as RefObject<HTMLDivElement | null>
					}
					sidePanelRef={
						{
							current: sidePaneElement,
						} as unknown as RefObject<HTMLDivElement | null>
					}
				>
					{children}
				</DocumentNavigationContextProvider>
			</DocumentSidePanelContextProvider>
		),
	};
}

function createSidePaneWrapper(
	panel: Partial<DocumentSidePanelContextType> = {},
) {
	const tocElement = document.createElement("div");
	const sidePaneElement = document.createElement("div");

	return {
		sidePaneElement,
		wrapper: ({ children }: { children: React.ReactNode }) => (
			<DocumentSidePanelContext.Provider
				value={{
					state: {
						isOpen: true,
						sections: {
							footnotes: false,
							authors: false,
							keywords: false,
							source: false,
						},
					},
					toggleSection: () => {
						throw new Error("toggleSection should not be called");
					},
					togglePanel: () => {
						throw new Error("togglePanel should not be called");
					},
					openSection: () => {
						throw new Error("openSection should not be called");
					},
					...panel,
				}}
			>
				<DocumentNavigationContextProvider
					tocRef={
						{
							current: tocElement,
						} as unknown as RefObject<HTMLDivElement | null>
					}
					sidePanelRef={
						{
							current: sidePaneElement,
						} as unknown as RefObject<HTMLDivElement | null>
					}
				>
					{children}
				</DocumentNavigationContextProvider>
			</DocumentSidePanelContext.Provider>
		),
	};
}

describe("DocumentNavigationContextProvider", () => {
	describe("navigateToHeading", () => {
		it("should allow to navigate to target heading", async () => {
			const { wrapper } = createDocumentWrapper();

			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const h2 = document.createElement("h2");
				h2.id = "heading-1";
				h2.scrollIntoView = scrollIntoView;

				return [h2];
			});

			vi.spyOn(document.body, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			result.current.navigateToHeading("heading-1");
			expect(querySelectorAll).toHaveBeenCalledWith(
				`#document-container #heading-1`,
			);
			expect(scrollIntoView).toHaveBeenCalled();
		});
	});

	describe("navigateToFootnoteRef", () => {
		it("should allow to navigate to target footnote reference", async () => {
			const { wrapper } = createDocumentWrapper();

			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;
				return [span];
			});

			vi.spyOn(document.body, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			result.current.navigateToFootnoteRef("fn-1");
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-fn-id~="fn-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
		});
		it("should cycle through multiple footnote references with the same id", async () => {
			const { wrapper } = createDocumentWrapper();

			const scrollIntoView1 = vi.fn();
			const scrollIntoView2 = vi.fn();
			const scrollIntoView3 = vi.fn();

			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span1 = document.createElement("span");
				span1.scrollIntoView = scrollIntoView1;

				const span2 = document.createElement("span");
				span2.scrollIntoView = scrollIntoView2;

				const span3 = document.createElement("span");
				span3.scrollIntoView = scrollIntoView3;

				return [span1, span2, span3];
			});

			vi.spyOn(document.body, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			// First call
			act(() => {
				result.current.navigateToFootnoteRef("fn-1");
			});
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-fn-id~="fn-1"]',
			);
			expect(scrollIntoView1).toHaveBeenCalledTimes(1);

			// Second call
			act(() => {
				result.current.navigateToFootnoteRef("fn-1");
			});
			expect(scrollIntoView2).toHaveBeenCalledTimes(1);

			// Third call
			act(() => {
				result.current.navigateToFootnoteRef("fn-1");
			});
			expect(scrollIntoView3).toHaveBeenCalledTimes(1);

			// Fourth call should cycle back to the first
			act(() => {
				result.current.navigateToFootnoteRef("fn-1");
			});
			expect(scrollIntoView1).toHaveBeenCalledTimes(2);
		});

		it("should restart from 0 when navigating to a different selector", async () => {
			const { wrapper } = createDocumentWrapper();

			const scrollIntoView1 = vi.fn();
			const scrollIntoView2 = vi.fn();
			const scrollIntoView3 = vi.fn();

			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span1 = document.createElement("span");
				span1.scrollIntoView = scrollIntoView1;

				const span2 = document.createElement("span");
				span2.scrollIntoView = scrollIntoView2;

				const span3 = document.createElement("span");
				span3.scrollIntoView = scrollIntoView3;

				return [span1, span2, span3];
			});

			vi.spyOn(document.body, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			// First call
			act(() => {
				result.current.navigateToFootnoteRef("fn-1");
			});
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-fn-id~="fn-1"]',
			);
			expect(scrollIntoView1).toHaveBeenCalledTimes(1);

			// Second call
			act(() => {
				result.current.navigateToFootnoteRef("fn-1");
			});
			expect(scrollIntoView2).toHaveBeenCalledTimes(1);

			// Now navigate to a different selector
			act(() => {
				result.current.navigateToFootnoteRef("fn-2");
			});
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-fn-id~="fn-2"]',
			);
			// Should call the first one again and not the third one
			expect(scrollIntoView1).toHaveBeenCalledTimes(2);
			expect(scrollIntoView3).toHaveBeenCalledTimes(0);
		});
	});

	describe("navigateToFootnote", () => {
		it("should allow to navigate to target footnote in side panel directly when already open", async () => {
			const openSection = vi.fn();
			const { sidePaneElement, wrapper } = createSidePaneWrapper({
				state: {
					isOpen: true,
					sections: {
						footnotes: true,
						authors: false,
						keywords: false,
						source: false,
					},
				},
				openSection,
			});

			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;

				return [span];
			});

			vi.spyOn(sidePaneElement, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			await act(() => {
				return result.current.navigateToFootnote("footnote-1");
			});

			expect(querySelectorAll).toHaveBeenCalledWith(
				'[data-fn-id~="footnote-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
			expect(openSection).toHaveBeenCalled();
		});

		it("should allow to navigate to target footnote in side panel opening it when closed", async () => {
			const openSection = vi.fn();
			const { sidePaneElement, wrapper } = createSidePaneWrapper({
				state: {
					isOpen: true,
					sections: {
						footnotes: false,
						authors: false,
						keywords: false,
						source: false,
					},
				},
				openSection,
			});

			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;

				return [span];
			});

			vi.spyOn(sidePaneElement, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			await act(() => {
				return result.current.navigateToFootnote("footnote-1");
			});

			expect(openSection).toHaveBeenCalledWith("footnotes");

			expect(querySelectorAll).toHaveBeenCalledWith(
				'[data-fn-id~="footnote-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
		});

		it("should open the side panel if it is closed when navigating to a footnote", async () => {
			const openSection = vi.fn();
			const { sidePaneElement, wrapper } = createSidePaneWrapper({
				state: {
					isOpen: false,
					sections: {
						footnotes: true,
						authors: false,
						keywords: false,
						source: false,
					},
				},
				openSection,
			});
			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;

				return [span];
			});

			vi.spyOn(sidePaneElement, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			await act(() => {
				return result.current.navigateToFootnote("footnote-1");
			});
			expect(openSection).toHaveBeenCalled();

			await new Promise((r) => setTimeout(r, 700)); // wait for the panel and section animation
			expect(querySelectorAll).toHaveBeenCalledWith(
				'[data-fn-id~="footnote-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
		});

		it('should open the side panel and the "footnotes" section if both are closed when navigating to a footnote', async () => {
			const openSection = vi.fn();
			const { sidePaneElement, wrapper } = createSidePaneWrapper({
				state: {
					isOpen: false,
					sections: {
						footnotes: false,
						authors: false,
						keywords: false,
						source: false,
					},
				},
				openSection,
			});
			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;

				return [span];
			});

			vi.spyOn(sidePaneElement, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			await act(() => {
				return result.current.navigateToFootnote("footnote-1");
			});
			// openSection will open both the panel and the section
			expect(openSection).toHaveBeenCalledWith("footnotes");
			expect(querySelectorAll).toHaveBeenCalledWith(
				'[data-fn-id~="footnote-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
		});
	});

	describe("navigateToBibliographicReferenceRef", () => {
		it("should allow to navigate to target bibliographic reference ref", async () => {
			const scrollIntoView = vi.fn();

			const { wrapper } = createDocumentWrapper();

			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;
				return [span];
			});

			vi.spyOn(document.body, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			result.current.navigateToBibliographicReferenceRef("bibref-1");
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-bibref-id~="bibref-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
		});

		it("should cycle through multiple bibliographic reference refs with the same id", async () => {
			const scrollIntoView1 = vi.fn();
			const scrollIntoView2 = vi.fn();
			const scrollIntoView3 = vi.fn();

			const { wrapper } = createDocumentWrapper();

			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span1 = document.createElement("span");
				span1.scrollIntoView = scrollIntoView1;

				const span2 = document.createElement("span");
				span2.scrollIntoView = scrollIntoView2;

				const span3 = document.createElement("span");
				span3.scrollIntoView = scrollIntoView3;

				return [span1, span2, span3];
			});

			vi.spyOn(document.body, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			// First call
			act(() => {
				result.current.navigateToBibliographicReferenceRef("bibref-1");
			});
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-bibref-id~="bibref-1"]',
			);
			expect(scrollIntoView1).toHaveBeenCalledTimes(1);

			// Second call
			act(() => {
				result.current.navigateToBibliographicReferenceRef("bibref-1");
			});
			expect(scrollIntoView2).toHaveBeenCalledTimes(1);

			// Third call
			act(() => {
				result.current.navigateToBibliographicReferenceRef("bibref-1");
			});

			expect(scrollIntoView3).toHaveBeenCalledTimes(1);

			// Fourth call should cycle back to the first
			act(() => {
				result.current.navigateToBibliographicReferenceRef("bibref-1");
			});
			expect(scrollIntoView1).toHaveBeenCalledTimes(2);
		});

		it("should restart from 0 when navigating to a different selector", async () => {
			const { wrapper } = createDocumentWrapper();

			const scrollIntoView1 = vi.fn();
			const scrollIntoView2 = vi.fn();
			const scrollIntoView3 = vi.fn();

			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span1 = document.createElement("span");
				span1.scrollIntoView = scrollIntoView1;

				const span2 = document.createElement("span");
				span2.scrollIntoView = scrollIntoView2;

				const span3 = document.createElement("span");
				span3.scrollIntoView = scrollIntoView3;

				return [span1, span2, span3];
			});

			vi.spyOn(document.body, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);

			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			// First call
			act(() => {
				result.current.navigateToBibliographicReferenceRef("bibref-1");
			});
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-bibref-id~="bibref-1"]',
			);
			expect(scrollIntoView1).toHaveBeenCalledTimes(1);

			// Second call
			act(() => {
				result.current.navigateToBibliographicReferenceRef("bibref-1");
			});
			expect(scrollIntoView2).toHaveBeenCalledTimes(1);

			// Now navigate to a different selector
			act(() => {
				result.current.navigateToBibliographicReferenceRef("bibref-2");
			});
			expect(querySelectorAll).toHaveBeenCalledWith(
				'#document-container [data-bibref-id~="bibref-2"]',
			);
			// Should call the first one again and not the third one
			expect(scrollIntoView1).toHaveBeenCalledTimes(2);
			expect(scrollIntoView3).toHaveBeenCalledTimes(0);
		});
	});

	describe("navigateToBibliographicReference", () => {
		it("should allow to navigate to target bibliographic reference in side panel directly when already open", async () => {
			const openSection = vi.fn();
			const { sidePaneElement, wrapper } = createSidePaneWrapper({
				state: {
					isOpen: true,
					sections: {
						footnotes: false,
						authors: false,
						keywords: false,
						source: false,
						bibliographicReferences: true,
					},
				},
				openSection,
			});
			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;

				return [span];
			});

			vi.spyOn(sidePaneElement, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			await act(() => {
				return result.current.navigateToBibliographicReference("ref-1");
			});
			expect(querySelectorAll).toHaveBeenCalledWith(
				'[data-bibref-id~="ref-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
			expect(openSection).toHaveBeenCalled();
		});

		it("should allow to navigate to target bibliographic reference in side panel opening section and panel when closed", async () => {
			const openSection = vi.fn();
			const { sidePaneElement, wrapper } = createSidePaneWrapper({
				state: {
					isOpen: true,
					sections: {
						footnotes: false,
						authors: false,
						keywords: false,
						source: false,
						bibliographicReferences: false,
					},
				},
				openSection,
			});
			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => {
				const span = document.createElement("span");
				span.scrollIntoView = scrollIntoView;

				return [span];
			});

			vi.spyOn(sidePaneElement, "querySelectorAll").mockImplementation(
				querySelectorAll,
			);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper,
			});

			await act(() => {
				return result.current.navigateToBibliographicReference("ref-1");
			});
			expect(openSection).toHaveBeenCalledWith("bibliographicReferences");

			expect(querySelectorAll).toHaveBeenCalledWith(
				'[data-bibref-id~="ref-1"]',
			);
			expect(scrollIntoView).toHaveBeenCalled();
		});
	});
});
