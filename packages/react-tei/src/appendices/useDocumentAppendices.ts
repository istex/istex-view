import { useMemo } from "react";
import { useDocumentContext } from "../DocumentContextProvider";
import { getDocumentJsonAtPath } from "../parser/getDocumentJsonAtPath";

export const useDocumentAppendices = () => {
	const { jsonDocument } = useDocumentContext();
	return useMemo(() => {
		const back = getDocumentJsonAtPath(jsonDocument, ["TEI", "text", "back"]);

		if (!back || !Array.isArray(back.value)) {
			return null;
		}

		const appendicesDiv = back.value.find(
			(section) => section?.attributes?.["@type"] === "appendices",
		);

		return appendicesDiv ?? null;
	}, [jsonDocument]);
};
