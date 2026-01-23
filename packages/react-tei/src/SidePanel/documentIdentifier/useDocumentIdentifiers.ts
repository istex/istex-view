import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath";

export const useDocumentIdentifiers = (): DocumentJson[] => {
	const { jsonDocument } = useDocumentContext();

	return useMemo(() => {
		const analytic = getDocumentJsonAtPath(jsonDocument, [
			"TEI",
			"teiHeader",
			"fileDesc",
			"sourceDesc",
			"biblStruct",
			"analytic",
		]);

		if (!analytic || !Array.isArray(analytic.value)) {
			return [];
		}
		const idnos = analytic.value.filter(({ tag }) => tag === "idno");

		return idnos;
	}, [jsonDocument]);
};
