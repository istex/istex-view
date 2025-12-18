import type { DocumentJson } from "./document.js";

export const getDocumentJsonAtPath = (
	obj: DocumentJson[],
	path: string[],
	result?: DocumentJson,
): DocumentJson | undefined => {
	if (path.length === 0) {
		return result;
	}
	if (!obj) {
		return undefined;
	}

	if (!Array.isArray(obj)) {
		return getDocumentJsonAtPath([obj], path, result);
	}
	const [nextTag, ...restPath] = path;
	const nextObj = obj.find((item) => item.tag === nextTag);
	return getDocumentJsonAtPath(
		nextObj && Array.isArray(nextObj.value) ? nextObj.value : [],
		restPath,
		nextObj,
	);
};
