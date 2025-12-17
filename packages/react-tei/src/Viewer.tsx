import { Box, Stack } from "@mui/material";

import { DocumentBody } from "./DocumentBody.js";
import { DocumentContextProvider } from "./DocumentContextProvider.js";
import { DocumentDrawer } from "./DocumentDrawer.js";
import { DocumentTitle } from "./DocumentTitle.js";
import { I18nProvider } from "./i18n/I18nProvider.js";
import type { DocumentJson } from "./parser/document.js";
import { useDocumentParser } from "./parser/useDocumentParser.js";

export const Viewer = ({ document }: { document: string }) => {
	const jsonDocument = useDocumentParser(document);

	const tei: DocumentJson = (Array.isArray(jsonDocument)
		? jsonDocument.find(({ tag }) => tag === "TEI")
		: undefined) ?? { tag: "TEI", attributes: {}, value: [] };

	const text: DocumentJson = (Array.isArray(tei.value)
		? tei.value.find(({ tag }) => tag === "text")
		: undefined) ?? { tag: "text", attributes: {}, value: [] };

	const header: DocumentJson = (Array.isArray(tei.value)
		? tei.value.find(({ tag }) => tag === "teiHeader")
		: undefined) ?? { tag: "teiHeader", attributes: {}, value: [] };

	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				<Box component="article" sx={{ flexGrow: 1, display: "flex", px: 2 }}>
					<Stack
						sx={{
							maxWidth: "740px",
							width: "100%",
							margin: "auto",
							padding: 8,
							backgroundColor: "white",
						}}
						spacing={2}
						component="section"
					>
						<DocumentTitle data={header} />
						<DocumentBody text={text} />
					</Stack>
					<DocumentDrawer teiHeader={header} />
				</Box>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
