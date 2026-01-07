import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useViewerContext } from "../viewer/useViewerContext";
import { FileSelectorButton } from "./FileSelectorButton";

export function UploadPage() {
	const { t } = useTranslation();
	const {
		viewerLaunched,
		launchViewer,
		document,
		openDocument,
		openUnitexEnrichment,
	} = useViewerContext();

	const handleDocumentChange = (file: File | null) => {
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

	const handleUnitexEnrichmentChange = (file: File | null) => {
		if (!file) {
			return;
		}

		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result?.toString();
			if (!content) {
				return;
			}

			openUnitexEnrichment(content);
		};
		reader.readAsText(file);
	};

	if (viewerLaunched) {
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
				gap: 4,
			}}
		>
			<Stack gap={2}>
				<FileSelectorButton
					label={t("upload.selectTeiFile")}
					onChange={handleDocumentChange}
				/>
				<FileSelectorButton
					label={t("upload.selectUnitexEnrichment")}
					onChange={handleUnitexEnrichmentChange}
				/>
			</Stack>
			<Button
				disabled={!document}
				onClick={launchViewer}
				variant="contained"
				color="primary"
			>
				Launch Viewer
			</Button>
		</Stack>
	);
}
