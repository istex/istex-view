import type { DocumentJson } from "./document";

export const countTags = (
	documentJson: DocumentJson,
	tag: string,
	result: number = 0,
): number => {
	if (documentJson.tag === tag) {
		return result + 1;
	}

	if (Array.isArray(documentJson.value)) {
		return documentJson.value.reduce(
			(acc, child) => countTags(child, tag, acc),
			result,
		);
	}

	return result;
};
