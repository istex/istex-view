import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { DocumentJson } from "../parser/document.js";
import { Value } from "./Value.js";

type PersNameProps = {
	data: DocumentJson;
};

export const PersNamePart = ({ data }: PersNameProps) => {
	const { t } = useTranslation();
	if (!Array.isArray(data.value)) {
		console.warn("PersName data.value is not an array:", data.value);
		return null;
	}

	const descriptionType = useMemo(() => {
		if (data.tag === "roleName") {
			return data.attributes?.["@type"] ? data.attributes["@type"] : "roleName";
		}

		return data.tag;
	}, [data]);
	return (
		<span aria-description={t(`sidebar.author.${descriptionType}`)}>
			{data.value.map((item, index) => (
				<Value key={index} data={item} />
			))}
		</span>
	);
};
