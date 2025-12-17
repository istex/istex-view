import Stack from "@mui/material/Stack";

import { useViewerContext } from "../viewer/useViewerContext";
import { FileSelectorButton } from "./FileSelectorButton";

export function UploadPage() {
	const { document, openDocument } = useViewerContext();

	const handleFileChange = (file: File | null) => {
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result?.toString();
			if (!content) {
				return;
			}

			openDocument(content);
		};
		reader.readAsText(file);
	};

	if (document) {
		return null;
	}

	return (
		<Stack
			sx={{
				flexGrow: 1,
				maxWidth: "sm",
				alignItems: "center",
				justifyContent: "center",
				padding: 2,
				margin: "0 auto",
			}}
		>
			<FileSelectorButton onChange={handleFileChange} />
		</Stack>
	);
}
