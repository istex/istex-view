import { act } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DocumentContextProvider,
	type JsonTermEnrichment,
} from "../DocumentContextProvider";
import type { DocumentJson } from "../parser/document";
import type { TermCountByGroup } from "../termEnrichment/termCountRegistry";
import {
	DocumentSidePanelContextProvider,
	initialPanelState,
	useDocumentSidePanelContext,
} from "./DocumentSidePanelContext";
import type { MulticatCategory } from "./multicat/useParseMulticatCategories";

function TestWrapper({
	children,
	jsonDocument,
	multicatEnrichment,
	jsonUnitexEnrichment,
	termCountByGroup,
}: {
	children: React.ReactNode;
	jsonDocument: DocumentJson[];
	multicatEnrichment?: MulticatCategory[];
	jsonUnitexEnrichment?: JsonTermEnrichment;
	termCountByGroup?: TermCountByGroup;
}) {
	return (
		<DocumentContextProvider
			jsonDocument={jsonDocument}
			multicatEnrichment={multicatEnrichment}
			jsonUnitexEnrichment={jsonUnitexEnrichment}
			termCountByGroup={termCountByGroup}
		>
			<DocumentSidePanelContextProvider>
				{children}
			</DocumentSidePanelContextProvider>
		</DocumentContextProvider>
	);
}

describe("DocumentSidePanelContextProvider", () => {
	it("should initialize panel state with isOpen true and footnotes section open", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		// When enrichmentCount is 0, currentTab defaults to 'metadata'
		expect(result.current.state).toStrictEqual({
			...initialPanelState,
			currentTab: "metadata",
		});
	});

	it("should expose togglePanel function to toggle panelState.isOpen", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		expect(result.current).toHaveProperty("togglePanel");

		expect(result.current.state).toStrictEqual({
			...initialPanelState,
			currentTab: "metadata",
		});
		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			currentTab: "metadata",
			sections: initialPanelState.sections,
		});
		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			currentTab: "metadata",
			sections: initialPanelState.sections,
		});
	});

	it("should keep sections state unchanged when toggling panel", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		act(() => {
			result.current.toggleSection("footnotes");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: false,
			},
		});

		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: false,
			},
		});
	});

	it("should expose toggleSection function in the context", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		expect(result.current).toHaveProperty("toggleSection");

		expect(result.current.state).toStrictEqual({
			...initialPanelState,
			currentTab: "metadata",
		});
		act(() => {
			result.current.toggleSection("footnotes");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: false,
			},
		});
	});

	it("should open the panel when toggling a section from closed to open", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		// First, close the panel
		act(() => {
			result.current.togglePanel();
		});

		act(() => {
			result.current.toggleSection("footnotes");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: false,
			},
		});

		// Now, toggle the 'footnotes' section (which is currently closed)
		act(() => {
			result.current.toggleSection("footnotes");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: true,
			},
		});
	});

	it("should not update the panel isOpen when toggling a section from open to closed", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			currentTab: "metadata",
			sections: initialPanelState.sections,
		});

		act(() => {
			result.current.toggleSection("footnotes");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: false,
			},
		});
	});

	it("should expose selectTab function to change currentTab", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		expect(result.current).toHaveProperty("selectTab");

		expect(result.current.state.currentTab).toBe("metadata");

		act(() => {
			result.current.selectTab("enrichment");
		});

		expect(result.current.state.currentTab).toBe("enrichment");

		act(() => {
			result.current.selectTab("metadata");
		});

		expect(result.current.state.currentTab).toBe("metadata");
	});

	it("should expose openSection function to open a section and the panel", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		expect(result.current).toHaveProperty("openSection");

		// Close the panel first
		act(() => {
			result.current.togglePanel();
		});

		expect(result.current.state.isOpen).toBe(false);

		// Open a section that is currently closed
		act(() => {
			result.current.toggleSection("footnotes");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: false,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: false,
			},
		});

		// Use openSection to open it and open the panel
		act(() => {
			result.current.openSection("footnotes");
		});

		expect(result.current.state).toStrictEqual({
			isOpen: true,
			currentTab: "metadata",
			sections: {
				...initialPanelState.sections,
				footnotes: true,
			},
		});
	});

	it("should set currentTab to metadata when opening a metadata section", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		// Switch to enrichment tab
		act(() => {
			result.current.selectTab("enrichment");
		});

		expect(result.current.state.currentTab).toBe("enrichment");

		// Toggle a metadata section
		act(() => {
			result.current.toggleSection("keywords");
		});

		expect(result.current.state.currentTab).toBe("metadata");
	});

	it("should set currentTab to enrichment when opening an enrichment section", async () => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={[]}>{children}</TestWrapper>
			),
		});

		expect(result.current.state.currentTab).toBe("metadata");

		// Toggle an enrichment section (termEnrichment_date)
		act(() => {
			result.current.toggleSection("termEnrichment_date");
		});

		expect(result.current.state.currentTab).toBe("enrichment");
	});

	it.each<{
		description: string;
		jsonDocument: DocumentJson[];
		multicatEnrichment?: MulticatCategory[];
		jsonUnitexEnrichment?: JsonTermEnrichment;
		termCountByGroup?: TermCountByGroup;
		expectedCount: number;
	}>([
		{
			description: "no enrichments",
			jsonDocument: [] as DocumentJson[],
			multicatEnrichment: undefined,
			jsonUnitexEnrichment: undefined,
			termCountByGroup: undefined,
			expectedCount: 0,
		},
		{
			description: "term enrichments",
			jsonDocument: [],
			multicatEnrichment: undefined,
			jsonUnitexEnrichment: {
				date: [
					{
						term: "2000",
						displayed: true,
					},
				],
			},
			termCountByGroup: {
				date: {
					"2000": 1,
				},
			},
			expectedCount: 1,
		},
		{
			description: "multicat enrichments",
			jsonDocument: [],
			multicatEnrichment: [
				{
					scheme: "scopus",
					keywords: [
						{
							level: 1,
							keyword: "Biology",
							children: [],
						},
					],
				},
				{
					scheme: "wos",
					keywords: [
						{
							level: 1,
							keyword: "Medicine",
							children: [],
						},
					],
				},
			],
			jsonUnitexEnrichment: undefined,
			termCountByGroup: undefined,
			expectedCount: 2,
		},
	])("should calculate enrichmentCount correctly with $description", async ({
		jsonDocument,
		multicatEnrichment,
		jsonUnitexEnrichment,
		termCountByGroup,
		expectedCount,
	}) => {
		const { result } = await renderHook(() => useDocumentSidePanelContext(), {
			wrapper: ({ children }) => (
				<TestWrapper
					jsonDocument={jsonDocument}
					multicatEnrichment={multicatEnrichment}
					jsonUnitexEnrichment={jsonUnitexEnrichment}
					termCountByGroup={termCountByGroup}
				>
					{children}
				</TestWrapper>
			),
		});

		expect(result.current.enrichmentCount).toBe(expectedCount);
	});
});
