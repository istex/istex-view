import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath";

export const useDocumentBibliographicReferences = () => {
	const { jsonDocument } = useDocumentContext();
	return useMemo(() => {
		const back = getDocumentJsonAtPath(jsonDocument, ["TEI", "text", "back"]);

		if (!back || !Array.isArray(back.value)) {
			return {
				bibliographicReferences: [],
				count: 0,
			};
		}

		const referencesDiv = back.value.find(
			(section) => section?.attributes?.["@type"] === "references",
		);

		if (!referencesDiv || !Array.isArray(referencesDiv.value)) {
			return {
				bibliographicReferences: [],
				count: 0,
			};
		}

		const listBibl = referencesDiv.value.find(
			(docJson: DocumentJson) => docJson?.tag === "listBibl",
		);
		if (!listBibl || !Array.isArray(listBibl.value)) {
			return {
				bibliographicReferences: [],
				count: 0,
			};
		}

		const bibliographicReferences = listBibl.value.filter(
			({ tag }) => tag === "bibl",
		);

		return {
			bibliographicReferences,
			count: bibliographicReferences.length,
		};
	}, [jsonDocument]);
};
