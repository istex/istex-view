import { useMemo } from "react";
import { useDocumentContext } from "../DocumentContextProvider.js";
import type { DocumentJson } from "../parser/document.js";

const getPathFromDocumentJson = (
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
		return getPathFromDocumentJson([obj], path, result);
	}
	const [nextTag, ...restPath] = path;
	const nextObj = obj.find((item) => item.tag === nextTag);
	return getPathFromDocumentJson(
		nextObj && Array.isArray(nextObj.value) ? nextObj.value : [],
		restPath,
		nextObj,
	);
};

export const useAuthors = (): DocumentJson[] => {
	const { jsonDocument } = useDocumentContext();

	const authors: DocumentJson[] = useMemo(() => {
		const analytic: DocumentJson | undefined = getPathFromDocumentJson(
			jsonDocument,
			["TEI", "teiHeader", "fileDesc", "sourceDesc", "biblStruct", "analytic"],
		);

		if (!analytic || !Array.isArray(analytic.value)) {
			return [];
		}

		const authors = analytic.value.filter(({ tag }) => tag === "author");

		return authors
			.filter((author) => {
				if (!author.value || !Array.isArray(author.value)) {
					console.warn("Author tag has no value or value is not an array", {
						author,
					});
					return false;
				}
				return true;
			})
			.map((author) => {
				return {
					...author,
					value: (Array.isArray(author.value) ? author.value : []).filter(
						({ tag }) => tag !== "#text",
					),
				};
			});
	}, [jsonDocument]);

	return authors;
};
