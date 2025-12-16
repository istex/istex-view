import type { DocumentJsonValue } from "./parser/document.js";
import { DocumentTag } from "./tags/DocumentTag.js";

export const DocumentBody = ({ tei }: { tei: DocumentJsonValue }) => {
	return <DocumentTag data={tei} />;
};
