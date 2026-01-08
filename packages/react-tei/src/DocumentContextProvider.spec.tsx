import { act } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentContextProvider,
	useDocumentContext,
} from "./DocumentContextProvider";

describe("DocumentContextProvider", () => {
	describe("useDocumentContext", () => {
		it("should throw an error when used outside of DocumentContextProvider", async () => {
			await expect(() =>
				renderHook(() => useDocumentContext()),
			).rejects.toThrowError(
				"useDocumentContext must be used within a DocumentContextProvider",
			);
		});

		it("should initialize panel state with isOpen true and authors section open", async () => {
			const { result } = await renderHook(() => useDocumentContext(), {
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: {
					authors: true,
					keywords: true,
					source: true,
					footnotes: true,
					bibliographicReferences: true,
					unitext_date: true,
					unitext_orgName: true,
					unitext_persName: true,
					unitext_placeName: true,
					unitext_geogName: true,
				},
			});
		});

		describe("togglePanel", () => {
			it("should allow to toggle panelState.isOpen", async () => {
				const { result } = await renderHook(() => useDocumentContext(), {
					wrapper: ({ children }) => (
						<DocumentContextProvider jsonDocument={[]}>
							{children}
						</DocumentContextProvider>
					),
				});

				expect(result.current.panel).toHaveProperty("togglePanel");

				expect(result.current.panel.state).toStrictEqual({
					isOpen: true,
					sections: {
						authors: true,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
				});
				act(() => {
					result.current.panel.togglePanel();
				});

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: {
						authors: true,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
				});
				act(() => {
					result.current.panel.togglePanel();
				});

				expect(result.current.panel.state).toStrictEqual({
					isOpen: true,
					sections: {
						authors: true,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
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
						authors: false,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
				});

				act(() => {
					result.current.panel.togglePanel();
				});

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: {
						authors: false,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
				});
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

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: {
					authors: true,
					keywords: true,
					source: true,
					footnotes: true,
					bibliographicReferences: true,
					unitext_date: true,
					unitext_orgName: true,
					unitext_persName: true,
					unitext_placeName: true,
					unitext_geogName: true,
				},
			});
			act(() => {
				result.current.panel.toggleSection("authors");
			});

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: {
					authors: false,
					keywords: true,
					source: true,
					footnotes: true,
					bibliographicReferences: true,
					unitext_date: true,
					unitext_orgName: true,
					unitext_persName: true,
					unitext_placeName: true,
					unitext_geogName: true,
				},
			});
		});

		describe("toggleSection", () => {
			it(" should open the panel when toggling a section from closed to open", async () => {
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
						authors: false,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
				});

				// Now, toggle the 'authors' section (which is currently open)
				act(() => {
					result.current.panel.toggleSection("authors");
				});

				expect(result.current.panel.state).toStrictEqual({
					isOpen: true,
					sections: {
						authors: true,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
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
					sections: {
						authors: true,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
				});

				act(() => {
					result.current.panel.toggleSection("authors");
				});

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: {
						authors: false,
						keywords: true,
						source: true,
						footnotes: true,
						bibliographicReferences: true,
						unitext_date: true,
						unitext_orgName: true,
						unitext_persName: true,
						unitext_placeName: true,
						unitext_geogName: true,
					},
				});
			});
		});
	});
});
