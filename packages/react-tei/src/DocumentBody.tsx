import { DocumentTag } from "./tags/DocumentTag.js";

export const DocumentBody = ({
	jsonDocument,
}: {
	jsonDocument: {
		TEI: Record<string, unknown>;
	};
}) => {
	return <DocumentTag name="TEI" data={jsonDocument.TEI} />;
};
