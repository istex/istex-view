import Stack from "@mui/material/Stack";

import { DocumentAbstract } from "./DocumentAbstract.js";
import { DocumentBody } from "./DocumentBody.js";
import { DocumentContextProvider } from "./DocumentContextProvider.js";
import { DocumentTitle } from "./DocumentTitle.js";
import { findTagByName } from "./helper/findTagByName.js";
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
				<Stack
					component="article"
					gap={2}
					flexGrow={1}
					height={height}
					maxHeight={height}
					width="100%"
					direction="row"
				>
					<Stack
						sx={{
							flexGrow: 1,
							overflowX: "hidden",
							overflowY: "auto",
						}}
						component="section"
					>
						<Stack
							marginInline="auto"
							maxWidth={{ xs: "100%", md: "740px" }}
							paddingBlock={4}
							gap={4}
						>
							<DocumentAbstract header={header} />

							<Stack
								component="section"
								sx={{
									gap: 4,
									padding: 8,
									backgroundColor: "white",
								}}
							>
								<DocumentTitle data={header} />
								<DocumentBody text={text} />
							</Stack>
						</Stack>
					</Stack>

					<DocumentSidePanel teiHeader={header} />
				</Stack>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
