import type { DocumentJson } from "../parser/document";

export const getRawText = (data: DocumentJson): string => {
	if (data.tag === "#text") {
		return (data.value as string) || "";
	}
	if (Array.isArray(data.value)) {
		return data.value.map(getRawText).join("");
	}
	return "";
};
