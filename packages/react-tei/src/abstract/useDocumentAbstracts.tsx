import { useMemo } from "react";
import { findChildrenByName } from "../helper/findChildrenByName";
import { findTagByName } from "../helper/findTagByName";
import type { DocumentJson } from "../parser/document";

export const UNSUPPORTED_ABSTRACT_HEAD = ["highlights"];

export function useDocumentAbstracts(teiHeader: DocumentJson | undefined) {
	return useMemo(() => {
		if (!teiHeader) {
			return [];
		}
		const profileDesc = findTagByName(teiHeader, "profileDesc");
		const abstracts = findChildrenByName(profileDesc, "abstract");

		return abstracts.filter((abstract) => {
			const head = findTagByName(abstract, "head", 2);
			const headContent = findTagByName(head, "#text", 2);
			if (typeof headContent?.value !== "string") {
				return true;
			}

			return !UNSUPPORTED_ABSTRACT_HEAD.includes(
				headContent.value.toLowerCase(),
			);
		});
	}, [teiHeader]);
}
