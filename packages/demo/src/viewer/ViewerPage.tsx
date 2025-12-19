import { Viewer } from "@istex/react-tei/Viewer.js";

import { useViewerContext } from "./useViewerContext";

export function ViewerPage() {
	const { document } = useViewerContext();

	if (!document) {
		return null;
	}

	return (
		<Viewer document={document} height="calc(100dvh - 49.5px - 118.5px)" />
	);
}
