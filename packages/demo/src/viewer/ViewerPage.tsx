import { Viewer } from "@istex/react-tei/Viewer.js";

import { useViewerContext } from "./useViewerContext";

export function ViewerPage() {
	const { viewerLaunched, document, unitexEnrichment } = useViewerContext();

	if (!viewerLaunched || !document) {
		return null;
	}

	return (
		<Viewer
			document={document}
			unitexEnrichment={unitexEnrichment}
			height="calc(100dvh - 49.5px - 118.5px)"
		/>
	);
}
