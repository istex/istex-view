import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { IS_DEBUG } from "../../debug/debug.const";
import type { DocumentJson } from "../../parser/document";
import { Value } from "../../tags/Value";

export const getDescriptionKey = (data: DocumentJson) => {
	const { tag, attributes } = data;

	if (tag === "roleName") {
		if (
			!attributes?.["@type"] ||
			!["honorific", "degree"].includes(attributes["@type"])
		) {
			IS_DEBUG &&
				console.warn("PersNamePart roleName missing or invalid @type:", data);
			return null;
		}
		return attributes["@type"];
	}

	if (
		[
			"genName",
			"nameLink",
			"roleName",
			"forename",
			"surname",
			"addName",
			"orgName",
		].includes(tag)
	) {
		return tag;
	}

	IS_DEBUG && console.warn("PersNamePart unknown tag:", data);
	return null;
};

export type PersNamePartProps = {
	data: DocumentJson;
};

export function PersNamePart({ data }: PersNamePartProps) {
	const { t } = useTranslation();
	if (!Array.isArray(data.value)) {
		IS_DEBUG &&
			console.warn("PersName data.value is not an array:", data.value);
		return null;
	}

	if (data.value.length === 0) {
		IS_DEBUG && console.warn("PersNamePart data.value is empty:", data);
		return null;
	}

	const descriptionType = useMemo(() => {
		return getDescriptionKey(data);
	}, [data]);
	return (
		<span
			aria-description={
				descriptionType ? t(`sidePanel.author.${descriptionType}`) : undefined
			}
		>
			{data.value.map((item, index) => (
				<Value key={index} data={item} />
			))}
		</span>
	);
}
