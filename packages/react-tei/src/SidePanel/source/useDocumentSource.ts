import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider.js";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath.js";

export const useDocumentSource = () => {
	const { jsonDocument } = useDocumentContext();

	return useMemo(() => {
		const monogr = getDocumentJsonAtPath(jsonDocument, [
			"TEI",
			"teiHeader",
			"sourceDesc",
			"biblStruct",
			"monogr",
		]);
		if (!monogr || !Array.isArray(monogr.value)) {
			return null;
		}
		const titles = monogr.value.filter(({ tag }) => tag === "title");

		const mainTitles = titles.filter(
			({ attributes }) =>
				attributes &&
				attributes["@type"] === "main" &&
				["m", "j"].includes(
					typeof attributes["@level"] === "string" ? attributes["@level"] : "",
				),
		);

		if (mainTitles.length > 1) {
			console.warn("Multiple main titles found in document monogr", {
				mainTitles,
			});
		}

		const mainTitle = mainTitles[0];
		if (!mainTitle) {
			return null;
		}

		const subTitles = titles.filter(
			({ attributes }) =>
				attributes &&
				attributes["@type"] === "sub" &&
				["m", "j"].includes(
					typeof attributes["@level"] === "string" ? attributes["@level"] : "",
				),
		);

		if (subTitles.length > 1) {
			console.warn("Multiple sub titles found in document monogr", {
				subTitles,
			});
		}

		const subTitle = subTitles[0];

		if (subTitle) {
			return [mainTitle, { tag: "#text", value: ", " }, subTitle];
		}

		return [mainTitle];
	}, [jsonDocument]);
};
