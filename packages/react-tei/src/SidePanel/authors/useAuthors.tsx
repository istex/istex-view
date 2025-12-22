import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath";

export const useAuthors = (): DocumentJson[] => {
	const { jsonDocument } = useDocumentContext();

	const authors: DocumentJson[] = useMemo(() => {
		const analytic: DocumentJson | undefined = getDocumentJsonAtPath(
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
