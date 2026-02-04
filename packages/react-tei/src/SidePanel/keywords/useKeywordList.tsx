import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import { getRawText } from "../../helper/getRawText";
import { countTags } from "../../parser/countTags";
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

	const rawText = getRawText({ tag, attributes, value }).trim();
	if (rawText === "") {
		return false;
	}

	if (countTags({ tag, value, attributes }, "term") === 0) {
		return false;
	}

	if (!attributes) {
		return true;
	}

	if (
		"@rend" in attributes &&
		["tocHeading1"].includes(attributes["@rend"] as string)
	) {
		return false;
	}

	if (
		"@scheme" in attributes &&
		["heading"].includes(attributes["@scheme"] as string)
	) {
		return false;
	}

	return true;
};

export const useKeywordList = (): {
	keywordList: DocumentJson[];
	count: number;
} => {
	const { jsonDocument } = useDocumentContext();

	const keywordList: DocumentJson[] = useMemo(() => {
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

	const count = keywordList.reduce((acc, keyword) => {
		return acc + countTags(keyword, "term");
	}, 0);

	return { keywordList, count };
};
