import type { DocumentJson } from "./parser/document.js";
import { Value } from "./tags/Value.js";

export const DocumentBody = ({ text }: { text: DocumentJson }) => {
	return <Value data={text.value} />;
};
