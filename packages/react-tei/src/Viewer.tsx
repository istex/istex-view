import { Box } from "@mui/material";
import { DocumentBody } from "./DocumentBody.js";
import { DocumentContextProvider } from "./DocumentContextProvider.js";
import { DocumentTitle } from "./DocumentTitle.js";
import { findTagByName } from "./helper/findTagByName.js";
import { I18nProvider } from "./i18n/I18nProvider.js";
import type { DocumentJson } from "./parser/document.js";
import { useDocumentParser } from "./parser/useDocumentParser.js";
import { DocumentSidePanel } from "./SidePanel/DocumentSidePanel.js";
import { TagCatalogProvider } from "./tags/TagCatalogProvider.js";
import { tagCatalog } from "./tags/tagCatalog.js";

export const Viewer = ({
	document,
	height = "100vh",
}: {
	document: string;
	height?: string;
}) => {
	const jsonDocument = useDocumentParser(document);

	const header: DocumentJson = findTagByName(jsonDocument, "teiHeader") ?? {
		tag: "teiHeader",
		attributes: {},
		value: [],
	};

	const text: DocumentJson = findTagByName(jsonDocument, "text") ?? {
		tag: "text",
		attributes: {},
		value: [],
	};

	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<Box
						component="article"
						sx={{
							flexGrow: 1,
							display: "flex",
							maxHeight: height,
						}}
					>
						<Box
							marginInline="auto"
							paddingBlock={4}
							gap={4}
							sx={{
								maxWidth: { xs: "100%", sm: "100%", md: "740px" },
								margin: "auto",
								overflowY: "scroll",
								maxHeight: height,
								p: 8,
								backgroundColor: "white",
							}}
							component="section"
						>
							<DocumentTitle data={header} />
							<DocumentBody text={text} />
						</Box>
						<DocumentSidePanel teiHeader={header} />
					</Box>
				</TagCatalogProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
