import type { DocumentJson } from "../parser/document";

export const mapTargetTags = (
	document: DocumentJson,
	tag: string,
	replaceTag: (tag: DocumentJson) => DocumentJson,
	isStopTag: (tag: DocumentJson) => boolean = () => false,
): DocumentJson => {
	// if the current document is a stop tag, we do not process its children
	if (isStopTag(document)) {
		return document;
	}
	if (document.tag === tag) {
		return replaceTag(document);
	}

	return {
		...document,
		value: Array.isArray(document.value)
			? document.value.map((child) =>
					mapTargetTags(child, tag, replaceTag, isStopTag),
				)
			: document.value,
	};
};
