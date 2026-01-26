import { act } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentSidePanelContextProvider,
	initialPanelState,
	useDocumentSidePanelContext,
} from "./DocumentSidePanelContext";

describe("DocumentSidePanelContextProvider", () => {
	it("should initialize panel state with isOpen true and authors section open", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					{children}
				</DocumentSidePanelContextProvider>
			),
		});

		expect(result.current.state).toStrictEqual(initialPanelState);
	});

	it("should expose togglePanel function to toggle panelState.isOpen", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					{children}
				</DocumentSidePanelContextProvider>
			),
		});

		expect(result.current).toHaveProperty("togglePanel");

		expect(result.current.state).toStrictEqual(initialPanelState);
		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			sections: initialPanelState.sections,
		});
		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			sections: initialPanelState.sections,
		});
	});

	it("should keep sections state unchanged when toggling panel", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					{children}
				</DocumentSidePanelContextProvider>
			),
		});

		act(() => {
			result.current.toggleSection("authors");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			sections: {
				...initialPanelState.sections,
				authors: false,
			},
		});

		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			sections: {
				...initialPanelState.sections,
				authors: false,
			},
		});
	});

	it("should expose toggleSection function in the context", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					{children}
				</DocumentSidePanelContextProvider>
			),
		});

		expect(result.current).toHaveProperty("toggleSection");

		expect(result.current.state).toStrictEqual(initialPanelState);
		act(() => {
			result.current.toggleSection("authors");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			sections: {
				...initialPanelState.sections,
				authors: false,
			},
		});
	});

	it("should open the panel when toggling a section from closed to open", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					{children}
				</DocumentSidePanelContextProvider>
			),
		});

		// First, close the panel
		act(() => {
			result.current.togglePanel();
		});

		act(() => {
			result.current.toggleSection("authors");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			sections: {
				...initialPanelState.sections,
				authors: false,
			},
		});

		// Now, toggle the 'authors' section (which is currently open)
		act(() => {
			result.current.toggleSection("authors");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			sections: {
				...initialPanelState.sections,
				authors: true,
			},
		});
	});

	it("should not update the panel isOpen when toggling a section from open to closed", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					{children}
				</DocumentSidePanelContextProvider>
			),
		});

		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			sections: initialPanelState.sections,
		});

		act(() => {
			result.current.toggleSection("authors");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			sections: {
				...initialPanelState.sections,
				authors: false,
			},
		});
	});
});
