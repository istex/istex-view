import Box from "@mui/material/Box";
import { DocumentBody } from "./DocumentBody.js";
import { DocumentContextProvider } from "./DocumentContextProvider.js";
import { DocumentTitle } from "./DocumentTitle.js";
import { I18nProvider } from "./i18n/I18nProvider.js";
import type { DocumentJson } from "./parser/document.js";
import { useDocumentParser } from "./parser/useDocumentParser.js";
import { DocumentSidePanel } from "./SidePanel/DocumentSidePanel.js";

export const Viewer = ({
	document,
	height = "100vh",
}: {
	document: string;
	height?: string;
}) => {
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
				<Box
					component="article"
					sx={{
						flexGrow: 1,
						display: "flex",
						maxHeight: height,
					}}
				>
					<Box
						sx={{
							maxWidth: { xs: "100%", sm: "100%", md: "740px" },
							margin: "auto",
							overflowY: "scroll",
							maxHeight: height,
							p: 2,
							backgroundColor: "white",
						}}
						component="section"
					>
						<DocumentTitle data={header} />
						<DocumentBody text={text} />
					</Box>
					<DocumentSidePanel teiHeader={header} />
				</Box>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
