import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DIRECTION_NEXT,
	DIRECTION_PREVIOUS,
	type Direction,
} from "../../navigation/DocumentNavigationContext";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import { useEnrichmentAnnotationNavigation } from "./useEnrichmentAnnotationNavigation";

describe("useEnrichmentAnnotationNavigation", () => {
	it.each<{
		direction: Direction;
		fnName: keyof ReturnType<typeof useEnrichmentAnnotationNavigation>;
	}>([
		{ direction: DIRECTION_PREVIOUS, fnName: "goToPrevious" },
		{ direction: DIRECTION_NEXT, fnName: "goToNext" },
	])('should support navigating to the "%s" occurrence of a term', async ({
		direction,
		fnName,
	}) => {
		const navigateToBodyTargetSelector = vi.fn();
		const { result } = await renderHook(
			() => useEnrichmentAnnotationNavigation("example"),
			{
				wrapper: ({ children }) => (
					<TestDocumentNavigationContextProvider
						value={{
							navigateToBodyTargetSelector,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
				),
			},
		);

		const fn = result.current[fnName];

		act(() => {
			fn();
		});

		expect(navigateToBodyTargetSelector).toHaveBeenCalledWith(
			'[data-term="example"]',
			direction,
		);
	});
});
