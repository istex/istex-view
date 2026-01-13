import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { useCallback } from "react";
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
		openDocument,
		openUnitexEnrichment,
		openMulticatEnrichment,
		openNbEnrichment,
	} = useViewerContext();

	const handleDocumentChange = useCallback(
		async (file: File | null) => {
			if (!file) {
				return;
			}

			const content = await getFileContent(file);

			openDocument({ filename: file.name, content });
		},
		[openDocument],
	);

	const handleUnitexEnrichmentChange = useCallback(
		async (file: File | null) => {
			if (!file) {
				openUnitexEnrichment(null);
				return;
			}

			const content = await getFileContent(file);
			openUnitexEnrichment({ filename: file.name, content });
		},
		[openUnitexEnrichment],
	);

	const handleMulticatEnrichmentChange = useCallback(
		async (file: File | null) => {
			if (!file) {
				openMulticatEnrichment(null);
				return;
			}

			const content = await getFileContent(file);
			openMulticatEnrichment({ filename: file.name, content });
		},
		[openMulticatEnrichment],
	);

	const handleNbEnrichmentChange = useCallback(
		async (file: File | null) => {
			if (!file) {
				openNbEnrichment(null);
				return;
			}

			const content = await getFileContent(file);
			openNbEnrichment({ filename: file.name, content });
		},
		[openNbEnrichment],
	);

	if (viewerLaunched) {
		return null;
	}

	return (
		<Stack
			sx={{
				flexGrow: 1,
				maxWidth: "md",
				width: "100%",
				justifyContent: "center",
				padding: 2,
				margin: "0 auto",
				gap: 4,
			}}
		>
			<Stack gap={2} sx={{}}>
				<FileSelectorButton
					dataTestId="tei-file-selector-input"
					placeholder={t("upload.document.placeholder")}
					buttonLabel={t("upload.document.buttonLabel")}
					onChange={handleDocumentChange}
					required
				/>
				<FileSelectorButton
					dataTestId="unitex-enrichment-file-selector-input"
					placeholder={t("upload.unitex.placeholder")}
					buttonLabel={t("upload.unitex.buttonLabel")}
					onChange={handleUnitexEnrichmentChange}
				/>
				<FileSelectorButton
					dataTestId="multicat-enrichment-file-selector-input"
					placeholder={t("upload.multicat.placeholder")}
					buttonLabel={t("upload.multicat.buttonLabel")}
					onChange={handleMulticatEnrichmentChange}
				/>

				<FileSelectorButton
					dataTestId="nb-enrichment-file-selector-input"
					placeholder={t("upload.nb.placeholder")}
					buttonLabel={t("upload.nb.buttonLabel")}
					onChange={handleNbEnrichmentChange}
				/>
			</Stack>
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
