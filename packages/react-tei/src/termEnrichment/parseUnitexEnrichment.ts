import { IS_DEBUG } from "../debug/debug.const";
import { findChildrenByName } from "../helper/findChildrenByName";
import { findTagByName } from "../helper/findTagByName";
import { getTagText } from "../helper/getTagText";
import type { DocumentJson } from "../parser/document";

export type TermStatistic = {
	term: string;
	displayed: boolean;
};

export const getAnnotationTerm = (
	annotationBlock: DocumentJson | DocumentJson[],
): string | null => {
	const termTag = findTagByName(annotationBlock, "term");
	if (!termTag) {
		return null;
	}
	return getTagText(termTag);
};

export const exractTermFromAnnotationBlock = (
	documentFragment: DocumentJson,
): TermStatistic | null => {
	const term = getAnnotationTerm(documentFragment);
	if (!term) {
		return null;
	}

	return {
		term,
		displayed: true,
	};
};

export const getListAnnotationType = (
	listAnnotation: DocumentJson,
): string | null => {
	if (!listAnnotation.attributes?.["@type"]) {
		return null;
	}

	switch (listAnnotation.attributes["@type"]) {
		case "orgName": {
			switch (listAnnotation.attributes?.["@subtype"]) {
				case "funder":
					return "orgNameFunder";
				case "provider":
					return "orgNameProvider";
				default:
					return "orgName";
			}
		}
		case "ref": {
			switch (listAnnotation.attributes?.["@subtype"]) {
				case "bibl":
					return "refBibl";
				case "url":
					return "refUrl";
				default:
					IS_DEBUG &&
						console.warn(
							"Unknown ref subType, ignoring listAnnotation",
							listAnnotation,
						);
					return null;
			}
		}
		default:
			return listAnnotation.attributes["@type"];
	}
};

export const parseUnitexEnrichment = (
	unitexEnrichment: DocumentJson[] | null | undefined,
): Record<string, TermStatistic[]> => {
	if (!unitexEnrichment) {
		return {};
	}

	const ns1Standoff = findTagByName(unitexEnrichment, "ns1:standOff");

	if (!ns1Standoff || !Array.isArray(ns1Standoff.value)) {
		return {};
	}

	const listAnnotations = ns1Standoff.value.filter(
		(doc) => doc.tag === "ns1:listAnnotation",
	);

	const highlightsGroup = listAnnotations.reduce(
		(acc, listAnnotation) => {
			const type = getListAnnotationType(listAnnotation);
			if (!type) {
				IS_DEBUG &&
					console.warn("listAnnotation without type attribute", listAnnotation);
				return acc;
			}

			const annotations = findChildrenByName(listAnnotation, "annotationBlock");

			const terms: TermStatistic[] = annotations
				.map(exractTermFromAnnotationBlock)
				.filter((term): term is TermStatistic => term !== null);

			acc[type] = terms;
			return acc;
		},
		{} as Record<string, TermStatistic[]>,
	);

	return highlightsGroup;
};
