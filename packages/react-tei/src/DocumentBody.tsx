import type { DocumentJson } from "./parser/document";
import { Value } from "./tags/Value";

export const DocumentBody = ({ body }: { body: DocumentJson }) => {
	return <Value data={body.value} />;
};
