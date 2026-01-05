import { describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentContext,
	DocumentContextProvider,
} from "../DocumentContextProvider";
import { DocumentNavigationContextProvider } from "./DocumentNavigationContext";
import { useDocumentNavigation } from "./useNavigateToSection";

describe("DocumentNavigationContextProvider", () => {
	describe("navigateToHeading", () => {
		it("should allow to navigate to target heading", async () => {
			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => [
				{
					scrollIntoView,
				},
			]);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						<DocumentNavigationContextProvider
							documentRef={
								{
									current: {
										querySelectorAll,
									},
								} as any
							}
							sidePanelRef={
								{
									current: {
										querySelector: vi.fn(),
									},
								} as any
							}
						>
							{children}
						</DocumentNavigationContextProvider>
					</DocumentContextProvider>
				),
			});

			result.current.navigateToHeading("heading-1");
			expect(querySelectorAll).toHaveBeenCalledWith("#heading-1");
			expect(scrollIntoView).toHaveBeenCalled();
		});
	});

	describe("navigateToFootnoteRef", () => {
		it("should allow to navigate to target footnote reference", async () => {
			const scrollIntoView = vi.fn();
			const querySelectorAll = vi.fn().mockImplementation(() => [
				{
					scrollIntoView,
				},
			]);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						<DocumentNavigationContextProvider
							documentRef={
								{
									current: {
										querySelectorAll,
									},
								} as any
							}
							sidePanelRef={
								{
									current: {
										querySelector: vi.fn(),
									},
								} as any
							}
						>
							{children}
						</DocumentNavigationContextProvider>
					</DocumentContextProvider>
				),
			});

			result.current.navigateToFootnoteRef("fn-1");
			expect(querySelectorAll).toHaveBeenCalledWith("[data-fn-id='fn-1']");
			expect(scrollIntoView).toHaveBeenCalled();
		});
		it("should cycle through multiple footnote references with the same id", async () => {
			const scrollIntoView1 = vi.fn();
			const scrollIntoView2 = vi.fn();
			const scrollIntoView3 = vi.fn();
			const querySelectorAll = vi
				.fn()
				.mockImplementation(() => [
					{ scrollIntoView: scrollIntoView1 },
					{ scrollIntoView: scrollIntoView2 },
					{ scrollIntoView: scrollIntoView3 },
				]);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						<DocumentNavigationContextProvider
							documentRef={
								{
									current: {
										querySelectorAll,
									},
								} as any
							}
							sidePanelRef={
								{
									current: {
										querySelector: vi.fn(),
									},
								} as any
							}
						>
							{children}
						</DocumentNavigationContextProvider>
					</DocumentContextProvider>
				),
			});

			// First call
			result.current.navigateToFootnoteRef("fn-1");
			await new Promise((r) => setTimeout(r, 1));
			expect(querySelectorAll).toHaveBeenCalledWith("[data-fn-id='fn-1']");
			expect(scrollIntoView1).toHaveBeenCalledTimes(1);

			// Second call
			result.current.navigateToFootnoteRef("fn-1");
			await new Promise((r) => setTimeout(r, 1));
			expect(scrollIntoView2).toHaveBeenCalledTimes(1);

			// Third call
			result.current.navigateToFootnoteRef("fn-1");
			await new Promise((r) => setTimeout(r, 1));
			expect(scrollIntoView3).toHaveBeenCalledTimes(1);

			// Fourth call should cycle back to the first
			result.current.navigateToFootnoteRef("fn-1");
			await new Promise((r) => setTimeout(r, 1));
			expect(scrollIntoView1).toHaveBeenCalledTimes(2);
		});

		it("should restart from 0 when navigating to a different selector", async () => {
			const scrollIntoView1 = vi.fn();
			const scrollIntoView2 = vi.fn();
			const scrollIntoView3 = vi.fn();
			const querySelectorAll = vi
				.fn()
				.mockImplementation(() => [
					{ scrollIntoView: scrollIntoView1 },
					{ scrollIntoView: scrollIntoView2 },
					{ scrollIntoView: scrollIntoView3 },
				]);
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						<DocumentNavigationContextProvider
							documentRef={
								{
									current: {
										querySelectorAll,
									},
								} as any
							}
							sidePanelRef={
								{
									current: {
										querySelector: vi.fn(),
									},
								} as any
							}
						>
							{children}
						</DocumentNavigationContextProvider>
					</DocumentContextProvider>
				),
			});

			// First call
			result.current.navigateToFootnoteRef("fn-1");
			await new Promise((r) => setTimeout(r, 1));
			expect(querySelectorAll).toHaveBeenCalledWith("[data-fn-id='fn-1']");
			expect(scrollIntoView1).toHaveBeenCalledTimes(1);

			// Second call
			result.current.navigateToFootnoteRef("fn-1");
			await new Promise((r) => setTimeout(r, 1));
			expect(scrollIntoView2).toHaveBeenCalledTimes(1);

			// Now navigate to a different selector
			result.current.navigateToFootnoteRef("fn-2");
			await new Promise((r) => setTimeout(r, 1));
			expect(querySelectorAll).toHaveBeenCalledWith("[data-fn-id='fn-2']");
			// Should call the first one again and not the third one
			expect(scrollIntoView1).toHaveBeenCalledTimes(2);
			expect(scrollIntoView3).toHaveBeenCalledTimes(0);
		});
	});

	describe("navigateToFootnote", () => {
		it("should allow to navigate to target footnote in side panel directly when already open", async () => {
			const toggleSection = vi.fn();
			const scrollIntoView = vi.fn();
			const querySelector = vi.fn().mockImplementation(() => ({
				scrollIntoView,
			}));
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper: ({ children }) => (
					<DocumentContext.Provider
						value={{
							jsonDocument: [],
							panel: {
								state: {
									isOpen: true,
									sections: {
										footnotes: true,
										authors: false,
										keywords: false,
										source: false,
									},
								},
								toggleSection,
								togglePanel: () => {
									throw new Error("togglePanel should not be called");
								},
							},
						}}
					>
						<DocumentNavigationContextProvider
							documentRef={
								{
									current: {
										querySelectorAll: vi.fn(),
									},
								} as any
							}
							sidePanelRef={
								{
									current: {
										querySelector,
									},
								} as any
							}
						>
							{children}
						</DocumentNavigationContextProvider>
					</DocumentContext.Provider>
				),
			});

			result.current.navigateToFootnote("footnote-1");
			expect(querySelector).toHaveBeenCalledWith("[data-fn-id='footnote-1']");
			expect(scrollIntoView).toHaveBeenCalled();
			expect(toggleSection).not.toHaveBeenCalled();
		});

		it("should allow to navigate to target footnote in side panel opening it when closed", async () => {
			const toggleSection = vi.fn();
			const scrollIntoView = vi.fn();
			const querySelector = vi.fn().mockImplementation(() => ({
				scrollIntoView,
			}));
			const { result } = await renderHook(() => useDocumentNavigation(), {
				wrapper: ({ children }) => (
					<DocumentContext.Provider
						value={{
							jsonDocument: [],
							panel: {
								state: {
									isOpen: true,
									sections: {
										footnotes: false,
										authors: false,
										keywords: false,
										source: false,
									},
								},
								toggleSection,
								togglePanel: () => {
									throw new Error("togglePanel should not be called");
								},
							},
						}}
					>
						<DocumentNavigationContextProvider
							documentRef={
								{
									current: {
										querySelectorAll: vi.fn(),
									},
								} as any
							}
							sidePanelRef={
								{
									current: {
										querySelector,
									},
								} as any
							}
						>
							{children}
						</DocumentNavigationContextProvider>
					</DocumentContext.Provider>
				),
			});

			result.current.navigateToFootnote("footnote-1");
			await new Promise((r) => setTimeout(r, 1));
			expect(toggleSection).toHaveBeenCalledWith("footnotes");
			expect(querySelector).not.toHaveBeenCalled();
			expect(scrollIntoView).not.toHaveBeenCalled();
			await new Promise((r) => setTimeout(r, 700)); // wait for the panel and section animation
			expect(querySelector).toHaveBeenCalledWith("[data-fn-id='footnote-1']");
			expect(scrollIntoView).toHaveBeenCalled();
		});
	});
});
