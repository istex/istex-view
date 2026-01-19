import { act } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";
import { useListTeeftAnnotation } from "./useListTeeftAnnotation";

const teeftEnrichments: TermStatistic[] = [
	{ term: "machine learning", frequency: 10, displayed: true },
	{ term: "neural network", frequency: 5, displayed: true },
	{ term: "deep learning", frequency: 3, displayed: true },
];

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<DocumentContextProvider
			jsonDocument={[]}
			jsonTeeftEnrichment={teeftEnrichments}
		>
			{children}
		</DocumentContextProvider>
	);
}

function EmptyTestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<DocumentContextProvider jsonDocument={[]}>
			{children}
		</DocumentContextProvider>
	);
}

describe("useListTeeftAnnotation", () => {
	it("should return the correct annotations", async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: TestWrapper,
		});

		expect(result.result.current.annotations).toEqual(teeftEnrichments);
	});

	it("should return an empty array when no teeft enrichment is provided", async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: EmptyTestWrapper,
		});

		expect(result.result.current.annotations).toEqual([]);
	});

	it('should return displayStatus "all" when all annotations are displayed', async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: TestWrapper,
		});

		expect(result.result.current.displayStatus).toBe("all");
	});

	it('should return displayStatus "none" when no annotations are displayed', async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: TestWrapper,
		});

		// Toggle all terms off
		act(() => {
			result.result.current.toggleAll();
		});

		expect(result.result.current.displayStatus).toBe("none");
	});

	it('should return displayStatus "partial" when some annotations are displayed', async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: TestWrapper,
		});

		// Toggle one term off
		act(() => {
			result.result.current.toggleTerm("machine learning");
		});

		expect(result.result.current.displayStatus).toBe("partial");
	});

	it("should expose a toggleAll function that toggles all annotations", async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: TestWrapper,
		});

		// All displayed initially
		expect(result.result.current.annotations).toStrictEqual(teeftEnrichments);

		act(() => {
			result.result.current.toggleAll();
		});

		// All hidden
		expect(result.result.current.annotations).toStrictEqual(
			teeftEnrichments.map((a) => ({ ...a, displayed: false })),
		);

		act(() => {
			result.result.current.toggleAll();
		});

		// All displayed again
		expect(result.result.current.annotations).toStrictEqual(teeftEnrichments);
	});

	it("should expose a toggleTerm function that toggles a specific annotation", async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: TestWrapper,
		});

		// Initially displayed
		expect(result.result.current.annotations).toStrictEqual(teeftEnrichments);

		act(() => {
			result.result.current.toggleTerm("neural network");
		});

		// Now hidden
		expect(result.result.current.annotations).toStrictEqual([
			{ term: "machine learning", frequency: 10, displayed: true },
			{ term: "neural network", frequency: 5, displayed: false },
			{ term: "deep learning", frequency: 3, displayed: true },
		]);

		act(() => {
			result.result.current.toggleTerm("neural network");
		});

		// Displayed again
		expect(result.result.current.annotations).toStrictEqual(teeftEnrichments);
	});

	it('should return displayStatus "none" when annotations array is empty', async () => {
		const result = await renderHook(() => useListTeeftAnnotation(), {
			wrapper: EmptyTestWrapper,
		});

		expect(result.result.current.displayStatus).toBe("none");
	});
});
