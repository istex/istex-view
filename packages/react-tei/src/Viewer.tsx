import { XMLParser } from "fast-xml-parser";
import { useMemo } from "react";
import { DocumentBody } from "./DocumentBody.js";
import { DocumentDrawer } from "./DocumentDrawer.js";

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@",
});

export const Viewer = ({ document }: { document: string }) => {
	const jsonDocument = useMemo(() => parser.parse(document), [document]);
	return (
		<div>
			<DocumentBody jsonDocument={jsonDocument} />
			<DocumentDrawer
				teiHeader={jsonDocument.TEI.teiHeader as Record<string, unknown>}
			/>
		</div>
	);
};
