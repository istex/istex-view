import { Box } from "@mui/material";
import { XMLParser } from "fast-xml-parser";
import { useMemo } from "react";

import { DocumentBody } from "./DocumentBody.js";
import { DocumentContextProvider } from "./DocumentContextProvider.js";
import { DocumentDrawer } from "./DocumentDrawer.js";
import { I18nProvider } from "./i18n/I18nProvider.js";

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@",
});

export const Viewer = ({ document }: { document: string }) => {
	const jsonDocument = useMemo(() => parser.parse(document), [document]);
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				<Box component="main" sx={{ flexGrow: 1, display: "flex" }}>
					<Box sx={{ maxWidth: "1200px", margin: "auto" }} component="section">
						<DocumentBody jsonDocument={jsonDocument} />
					</Box>
					<DocumentDrawer
						teiHeader={jsonDocument.TEI.teiHeader as Record<string, unknown>}
					/>
				</Box>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
