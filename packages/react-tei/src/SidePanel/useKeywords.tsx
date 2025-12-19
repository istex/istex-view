import { useMemo } from "react";
import { useDocumentContext } from "../DocumentContextProvider.js";
import type { DocumentJson } from "../parser/document.js";
import { getDocumentJsonAtPath } from "../parser/getDocumentJsonAtPath.js";

const isValidKeyword = ({ tag, attributes }: DocumentJson): boolean => {
	if (tag !== "keywords") {
		return false;
	}

	if (!attributes) {
		return true;
	}

	if ("@rend" in attributes && ["tocHeading1"].includes(attributes["@rend"])) {
		return false;
	}

	if ("@scheme" in attributes && ["heading"].includes(attributes["@scheme"])) {
		return false;
	}

	return true;
};

export const useKeyWords = (): DocumentJson[] => {
	const { jsonDocument } = useDocumentContext();

	const keywords: DocumentJson[] = useMemo(() => {
		const profileDesc: DocumentJson | undefined = getDocumentJsonAtPath(
			jsonDocument,
			["TEI", "teiHeader", "profileDesc"],
		);

		if (!profileDesc || !Array.isArray(profileDesc.value)) {
			return [];
		}

		return profileDesc.value.filter(({ tag }) => tag === "textClass");
	}, [jsonDocument]);

	return keywords;
};
