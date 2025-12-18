import { Viewer } from "@istex/react-tei/Viewer.js";
import Stack from "@mui/material/Stack";

import { useViewerContext } from "./useViewerContext";

export function ViewerPage() {
	const { document } = useViewerContext();

	if (!document) {
		return null;
	}

	return (
		<Stack
			sx={{
				maxHeight: `calc(100dvh - 49.5px - 118.5px)`,
				overflowY: "auto",
				overflowX: "hidden",
			}}
		>
			<Viewer document={document} height="100%" />
		</Stack>
	);
}
