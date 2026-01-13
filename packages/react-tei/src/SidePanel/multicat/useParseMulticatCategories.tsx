import { useMemo } from "react";
import { findChildrenByName } from "../../helper/findChildrenByName";
import { findTagByName } from "../../helper/findTagByName";
import type { DocumentJson, DocumentJsonValue } from "../../parser/document";
import { useDocumentParser } from "../../parser/useDocumentParser";

export const ALLOWED_MULTICAT_SCHEMES = [
	"inist",
	"wos",
	"scopus",
	"science_metrix",
] as const;

export type Keywords = {
	level: number;
	keyword: DocumentJsonValue;
	children: Keywords[];
};

export function parseMulticatKeywords(keywords: DocumentJson[]): Keywords[] {
	const extractLevel = (term: DocumentJson): number =>
		Number.parseInt(term.attributes?.["@level"] ?? "1", 10);

	const splitAtNextSibling = (
		terms: DocumentJson[],
		currentLevel: number,
	): [DocumentJson[], DocumentJson[]] => {
		const nextSiblingIndex = terms.findIndex(
			(term) => extractLevel(term) <= currentLevel,
		);
		return nextSiblingIndex === -1
			? [terms, []]
			: [terms.slice(0, nextSiblingIndex), terms.slice(nextSiblingIndex)];
	};

	const buildTree = (
		terms: DocumentJson[],
		parentLevel: number,
	): Keywords[] => {
		const [first, ...rest] = terms;
		if (!first) {
			return [];
		}

		const level = extractLevel(first);

		if (level !== parentLevel + 1) {
			return buildTree(rest, parentLevel);
		}

		const [childrenTerms, remainingTerms] = splitAtNextSibling(rest, level);
		const children = buildTree(childrenTerms, level);
		const node: Keywords = {
			level,
			keyword: first.value,
			children,
		};

		return [node, ...buildTree(remainingTerms, parentLevel)];
	};

	return buildTree(keywords, 0);
}

export function parseMulticatScheme(scheme: string | undefined) {
	if (!scheme) {
		return null;
	}

	if (scheme === "https://inist-category.data.istex.fr") {
		return "inist";
	}

	return scheme.replaceAll("#", "").replaceAll("-", "_");
}

export function useParseMulticatCategories(
	document: string | null | undefined,
): MulticatCategory[] {
	const documentJson = useDocumentParser(document);
	return useMemo(() => {
		if (!documentJson) {
			return [];
		}

		const annotationList = findTagByName(documentJson, "ns1:listAnnotation", 3);
		const annotationBlock = findTagByName(annotationList, "annotationBlock", 2);

		return findChildrenByName(annotationBlock, "keywords")
			.map((keywords) => {
				const terms = findChildrenByName(keywords, "term");
				return {
					scheme: parseMulticatScheme(keywords.attributes?.["@scheme"]),
					keywords: parseMulticatKeywords(terms),
				};
			})
			.filter((category): category is MulticatCategory => {
				return ALLOWED_MULTICAT_SCHEMES.includes(
					category.scheme as (typeof ALLOWED_MULTICAT_SCHEMES)[number],
				);
			});
	}, [documentJson]);
}

export type MulticatCategory = {
	scheme: (typeof ALLOWED_MULTICAT_SCHEMES)[number] | null;
	keywords: Keywords[];
};
