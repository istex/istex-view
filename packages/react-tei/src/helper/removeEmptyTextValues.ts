import type { DocumentJson } from "../parser/document.js";

export function removeEmptyTextValues(
	documents: DocumentJson[],
): DocumentJson[] {
	return documents
		.map((doc) => {
			if (Array.isArray(doc.value)) {
				return {
					...doc,
					value: removeEmptyTextValues(doc.value),
				};
			}
			return doc;
		})
		.filter((doc) => {
			if (typeof doc.value === "string" && doc.value.trim() === "") {
				return false;
			}

			return true;
		});
}
