import { Button, List, ListItem } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useViewerContext } from "../viewer/useViewerContext";
import { FileSelectorButton } from "./FileSelectorButton";

export const getFileContent = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result?.toString();
			if (content) {
				resolve(content);
			} else {
				reject(new Error("File content is empty"));
			}
		};
		reader.onerror = () => {
			reject(new Error("Error reading file"));
		};
		reader.readAsText(file);
	});
};

export function UploadPage() {
	const { t } = useTranslation();
	const {
		viewerLaunched,
		launchViewer,
		document,
		unitexEnrichment,
		openDocument,
		openUnitexEnrichment,
	} = useViewerContext();

	const handleDocumentChange = async (file: File | null) => {
		if (!file) {
			return;
		}

		const content = await getFileContent(file);

		openDocument({ filename: file.name, content });
	};

	const handleUnitexEnrichmentChange = async (file: File | null) => {
		if (!file) {
			return;
		}

		const content = await getFileContent(file);
		openUnitexEnrichment({ filename: file.name, content });
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
					dataTestId="tei-file-selector-input"
					label={t("upload.selectTeiFile")}
					onChange={handleDocumentChange}
				/>
				<FileSelectorButton
					dataTestId="unitex-enrichment-file-selector-input"
					label={t("upload.selectUnitexEnrichment")}
					onChange={handleUnitexEnrichmentChange}
				/>
			</Stack>
			<List>
				<ListItem>
					{`${t("upload.teiFile")} ${document?.filename ?? t("upload.noFileSelected")}`}
				</ListItem>
				<ListItem>
					{`${t("upload.unitexFile")} ${
						unitexEnrichment?.filename ?? t("upload.noFileSelected")
					}`}
				</ListItem>
			</List>
			<Button
				disabled={!document}
				onClick={launchViewer}
				variant="contained"
				color="primary"
			>
				{t("upload.launchViewer")}
			</Button>
		</Stack>
	);
}
