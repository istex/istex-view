import type { DocumentJson } from "./document";

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
	const nextObjList = obj.filter((item) => item.tag === nextTag);

	for (const nextObj of nextObjList) {
		const found = getDocumentJsonAtPath(
			nextObj && Array.isArray(nextObj.value) ? nextObj.value : [],
			restPath,
			nextObj,
		);
		if (found) {
			return found;
		}
	}

	return undefined;
};
