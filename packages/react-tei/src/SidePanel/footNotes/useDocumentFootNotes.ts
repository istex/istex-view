import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath";

export const useDocumentFootNotes = () => {
	const { jsonDocument } = useDocumentContext();
	return useMemo(() => {
		const back = getDocumentJsonAtPath(jsonDocument, ["TEI", "text", "back"]);

		if (!back || !Array.isArray(back.value)) {
			return [];
		}

		const referencesDiv = back.value.find(
			(section) => section?.attributes?.["@type"] === "fn-group",
		);

		if (!referencesDiv || !Array.isArray(referencesDiv.value)) {
			return [];
		}

		return referencesDiv.value.filter(
			(docJson: DocumentJson) => docJson?.tag === "note",
		);
	}, [jsonDocument]);
};
