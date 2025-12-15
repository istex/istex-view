import { useContext } from "react";

import { ViewerContext } from "./ViewerContext";

export function useViewerContext() {
	const ctx = useContext(ViewerContext);
	if (!ctx) {
		throw new Error(
			"useViewerContext must be used within a ViewerContextProvider",
		);
	}
	return ctx;
}
