import type { DocumentJson } from "../parser/document";
import { findChildrenByName } from "./findChildrenByName";

export const getTagText = (tag: DocumentJson): string => {
	const textTags = findChildrenByName(tag, "#text");

	return textTags.find(
		(textTag) =>
			typeof textTag.value === "string" && textTag.value.trim().length > 0,
	)?.value as string;
};
