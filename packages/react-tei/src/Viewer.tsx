import { Box } from "@mui/material";

import { DocumentBody } from "./DocumentBody.js";
import { DocumentContextProvider } from "./DocumentContextProvider.js";
import { DocumentDrawer } from "./DocumentDrawer.js";
import { I18nProvider } from "./i18n/I18nProvider.js";
import type { DocumentJsonValue } from "./parser/document.js";
import { useDocumentParser } from "./parser/useDocumentParser.js";

export const Viewer = ({ document }: { document: string }) => {
	const jsonDocument = useDocumentParser(document);

	const tei: DocumentJsonValue = Array.isArray(jsonDocument)
		? (jsonDocument.find(({ tag }) => tag === "TEI") ?? [])
		: [];

	const header: DocumentJsonValue = Array.isArray(tei)
		? (tei.find(({ tag }) => tag === "teiHeader") ?? [])
		: [];

	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				<Box component="main" sx={{ flexGrow: 1, display: "flex" }}>
					<Box sx={{ maxWidth: "1200px", margin: "auto" }} component="section">
						<DocumentBody tei={tei} />
					</Box>
					<DocumentDrawer teiHeader={header} />
				</Box>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
