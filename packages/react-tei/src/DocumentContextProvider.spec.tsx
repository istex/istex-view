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
				sections: { authors: true, keywords: true },
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
					sections: { authors: true, keywords: true },
				});
				result.current.panel.togglePanel();
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: { authors: true, keywords: true },
				});
				result.current.panel.togglePanel();
				await new Promise((resolve) => setTimeout(resolve, 100));
				expect(result.current.panel.state).toStrictEqual({
					isOpen: true,
					sections: { authors: true, keywords: true },
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

				result.current.panel.toggleSection("authors");
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(result.current.panel.state).toStrictEqual({
					isOpen: true,
					sections: { authors: false, keywords: true },
				});

				result.current.panel.togglePanel();
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: { authors: false, keywords: true },
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
				sections: { authors: true, keywords: true },
			});
			result.current.panel.toggleSection("authors");
			await new Promise((resolve) => setTimeout(resolve, 100));

			expect(result.current.panel.state).toStrictEqual({
				isOpen: true,
				sections: { authors: false, keywords: true },
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
				result.current.panel.togglePanel();
				result.current.panel.toggleSection("authors");
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: { authors: false, keywords: true },
				});

				// Now, toggle the 'authors' section (which is currently open)
				result.current.panel.toggleSection("authors");
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(result.current.panel.state).toStrictEqual({
					isOpen: true,
					sections: { authors: true, keywords: true },
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

				result.current.panel.togglePanel();
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: { authors: true, keywords: true },
				});

				result.current.panel.toggleSection("authors");
				await new Promise((resolve) => setTimeout(resolve, 100));

				expect(result.current.panel.state).toStrictEqual({
					isOpen: false,
					sections: { authors: false, keywords: true },
				});
			});
		});
	});
});
