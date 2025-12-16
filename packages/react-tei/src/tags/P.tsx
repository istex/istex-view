import type { DocumentJson } from "../parser/document.js";
import { DocumentTag } from "./DocumentTag.js";

export const P = ({ data }: { data: DocumentJson }) => {
	return (
		<p>
			<DocumentTag data={data.value ?? []} />
		</p>
	);
};
