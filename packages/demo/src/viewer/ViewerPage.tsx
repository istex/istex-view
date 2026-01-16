import { Viewer } from "@istex/react-tei/Viewer.js";

import { useViewerContext } from "./useViewerContext";

export function ViewerPage() {
	const {
		viewerLaunched,
		document,
		unitexEnrichment,
		multicatEnrichment,
		nbEnrichment,
		teeftEnrichment,
	} = useViewerContext();

	if (!viewerLaunched || !document) {
		return null;
	}

	return (
		<Viewer
			document={document.content}
			unitexEnrichment={unitexEnrichment?.content}
			multicatEnrichment={multicatEnrichment?.content}
			nbEnrichment={nbEnrichment?.content}
			teeftEnrichment={teeftEnrichment?.content}
			height="calc(100dvh - 49.5px - 118.5px)"
		/>
	);
}
