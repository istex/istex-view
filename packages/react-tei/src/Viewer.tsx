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
				<div>
					<DocumentBody jsonDocument={jsonDocument} />
					<DocumentDrawer
						teiHeader={jsonDocument.TEI.teiHeader as Record<string, unknown>}
					/>
				</div>
			</DocumentContextProvider>
		</I18nProvider>
	);
};
