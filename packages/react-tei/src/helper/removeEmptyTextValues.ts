import type { DocumentJson } from "../parser/document";

const ALLOWED_EMPTY_TEXT_CONTENTS: DocumentJson["value"][] = [" ", "\n"];

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
			if (
				doc.tag === "#text" &&
				ALLOWED_EMPTY_TEXT_CONTENTS.includes(doc.value)
			) {
				return true;
			}

			if (typeof doc.value === "string" && doc.value.trim() === "") {
				return false;
			}

			return true;
		});
}
