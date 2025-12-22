import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath";

export const isValidKeyword = ({
	tag,
	attributes,
	value,
}: DocumentJson): boolean => {
	if (tag !== "keywords") {
		return false;
	}

	if (!Array.isArray(value) || value.length === 0) {
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

export const useKeywordList = (): DocumentJson[] => {
	const { jsonDocument } = useDocumentContext();

	const keywords: DocumentJson[] = useMemo(() => {
		const profileDesc: DocumentJson | undefined = getDocumentJsonAtPath(
			jsonDocument,
			["TEI", "teiHeader", "profileDesc"],
		);

		if (!profileDesc || !Array.isArray(profileDesc.value)) {
			return [];
		}

		const textClassList = profileDesc.value.filter(
			({ tag }) => tag === "textClass",
		);

		if (textClassList.length === 0) {
			return [];
		}

		const keywordsList: DocumentJson[] = textClassList.flatMap((textClass) => {
			if (!Array.isArray(textClass.value)) {
				return [];
			}

			const keywords = textClass.value.filter(isValidKeyword);

			return keywords;
		});

		return keywordsList;
	}, [jsonDocument]);

	return keywords;
};
