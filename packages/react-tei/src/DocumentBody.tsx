import type { DocumentJson } from "./parser/document.js";
import { Value } from "./tags/Value.js";

export const DocumentBody = ({ body }: { body: DocumentJson }) => {
	return <Value data={body.value} />;
};
