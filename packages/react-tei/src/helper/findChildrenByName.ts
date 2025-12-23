import type { DocumentJson } from "../parser/document";

export function findChildrenByName(
	document: DocumentJson | undefined,
	tagName: string,
): DocumentJson[] {
	if (!document || !Array.isArray(document.value)) {
		return [];
	}

	return document.value.filter(
		(doc): doc is DocumentJson => doc.tag === tagName,
	);
}
