import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider.js";
import type { DocumentJson } from "../../parser/document.js";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath.js";

export const useDocumentSources = (): DocumentJson[] => {
	const { jsonDocument } = useDocumentContext();

	return useMemo(() => {
		const monogr = getDocumentJsonAtPath(jsonDocument, [
			"TEI",
			"teiHeader",
			"fileDesc",
			"sourceDesc",
			"biblStruct",
			"monogr",
		]);

		if (!monogr || !Array.isArray(monogr.value)) {
			return [];
		}
		const titles = monogr.value.filter(({ tag }) => tag === "title");

		const mainTitles = titles.filter(
			({ attributes, value }) =>
				attributes &&
				attributes["@type"] === "main" &&
				["m", "j"].includes(
					typeof attributes["@level"] === "string" ? attributes["@level"] : "",
				) &&
				Array.isArray(value) &&
				value.length > 0,
		);

		if (mainTitles.length > 1) {
			console.warn("Multiple main titles found in document monogr", {
				mainTitles,
			});
		}

		const mainTitle = mainTitles[0];

		const subTitles = titles.filter(
			({ attributes, value }) =>
				attributes &&
				attributes["@type"] === "sub" &&
				["m", "j"].includes(
					typeof attributes["@level"] === "string" ? attributes["@level"] : "",
				) &&
				Array.isArray(value) &&
				value.length > 0,
		);

		if (subTitles.length > 1) {
			console.warn("Multiple sub titles found in document monogr", {
				subTitles,
			});
		}
		if (!mainTitle) {
			return [];
		}

		const subTitle = subTitles[0];

		if (subTitle) {
			return [mainTitle, subTitle];
		}

		return [mainTitle];
	}, [jsonDocument]);
};
