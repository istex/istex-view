import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderHook } from "vitest-browser-react";
import {
	DIRECTION_NEXT,
	DIRECTION_PREVIOUS,
	type Direction,
} from "../../navigation/DocumentNavigationContext";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import { useUnitexAnnotationNavigation } from "./useUnitexAnnotationNavigation";

describe("useUnitexAnnotationNavigation", () => {
	it.each<{
		direction: Direction;
		fnName: keyof ReturnType<typeof useUnitexAnnotationNavigation>;
	}>([
		{ direction: DIRECTION_PREVIOUS, fnName: "goToPrevious" },
		{ direction: DIRECTION_NEXT, fnName: "goToNext" },
	])('should support navigating to the "%s" occurrence of a term', async ({
		direction,
		fnName,
	}) => {
		const navigateToBodyTargetSelector = vi.fn();
		const { result } = await renderHook(
			() => useUnitexAnnotationNavigation("example"),
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
