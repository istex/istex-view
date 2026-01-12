import type { DocumentJson } from "../parser/document";

export const mapTargetTags = (
	document: DocumentJson,
	tag: string,
	replaceTag: (tag: DocumentJson) => DocumentJson,
): DocumentJson => {
	if (document.tag === tag) {
		return replaceTag(document);
	}

	return {
		...document,
		value: Array.isArray(document.value)
			? document.value.map((child) => mapTargetTags(child, tag, replaceTag))
			: document.value,
	};
};
