import type { DocumentJson } from "../parser/document.js";

const MAX_DEPTH = 5;

export function findTagByName(
	document: DocumentJson | DocumentJson[] | undefined,
	tagName: string,
	maxDepth = MAX_DEPTH,
): DocumentJson | undefined {
	if (!document || maxDepth <= 0) {
		return undefined;
	}

	const documents = ([] as DocumentJson[]).concat(document);

	for (const doc of documents) {
		if (doc.tag === tagName) {
			return doc;
		}

		if (Array.isArray(doc.value)) {
			const found = findTagByName(doc.value, tagName, maxDepth - 1);
			if (found) {
				return found;
			}
		}
	}

	return undefined;
}
