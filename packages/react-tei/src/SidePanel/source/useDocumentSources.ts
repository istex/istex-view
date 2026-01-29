import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDocumentContext } from "../../DocumentContextProvider";
import { IS_DEBUG } from "../../debug/debug.const";
import type { DocumentJson } from "../../parser/document";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath";

export const useDocumentSources = (): DocumentJson[] => {
	const { t } = useTranslation();
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
			IS_DEBUG &&
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

		const idnos = monogr.value.filter(({ tag }) => tag === "idno");
		const imprint = monogr.value.filter(({ tag }) => tag === "imprint");

		if (subTitles.length > 1) {
			IS_DEBUG &&
				console.warn("Multiple sub titles found in document monogr", {
					subTitles,
				});
		}
		if (!mainTitle) {
			return [];
		}

		const subTitle = subTitles[0];

		if (subTitle) {
			return [
				mainTitle,
				{
					tag: "#text",
					value: t("commons.colon"),
				},
				subTitle,
				...imprint,
				...idnos,
			];
		}

		return [mainTitle, ...imprint, ...idnos];
	}, [t, jsonDocument]);
};
