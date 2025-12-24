import { Value } from "../../tags/Value.js";
import { Accordion } from "../Accordion.js";
import { useDocumentSources } from "./useDocumentSources.js";

export const SourceSection = () => {
	const documentSources = useDocumentSources();

	if (documentSources.length === 0) {
		return null;
	}

	return (
		<Accordion name="source" label="sidePanel.source.title">
			<Value data={documentSources} />
		</Accordion>
	);
};
