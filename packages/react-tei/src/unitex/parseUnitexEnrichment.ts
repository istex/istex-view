import { findChildrenByName } from "../helper/findChildrenByName";
import { findTagByName } from "../helper/findTagByName";
import { getTagText } from "../helper/getTagText";
import type { DocumentJson } from "../parser/document";

export type TermStatistic = {
	term: string;
	frequency: number;
	displayed: boolean;
};

export const getAnnotationTerm = (
	annotationBlock: DocumentJson,
): string | null => {
	const termTag = findTagByName(annotationBlock, "term");
	if (!termTag) {
		return null;
	}
	return getTagText(termTag);
};

export const getAnnotationFrequency = (
	annotationBlock: DocumentJson,
): number | null => {
	const fsTag = findTagByName(annotationBlock, "fs");
	if (!fsTag || fsTag.attributes?.["@type"] !== "statistics") {
		console.warn(
			"No fs[type=statistics] tag found in annotationBlock",
			annotationBlock,
		);
		return null;
	}
	const fTag = findChildrenByName(fsTag, "f").find(
		(fTag) => fTag.attributes?.["@name"] === "frequency",
	);

	if (!fTag) {
		console.warn("No f[name=frequency] tag found in fs statistics", fsTag);
		return null;
	}

	const numericTag = findTagByName(fTag, "numeric");
	if (!numericTag) {
		console.warn("No numeric tag found in f frequency", fTag);
		return null;
	}

	const frequency = numericTag.attributes?.["@value"]
		? parseInt(numericTag.attributes["@value"], 10)
		: null;

	if (frequency === null || Number.isNaN(frequency)) {
		console.warn("Invalid frequency value in numeric tag", numericTag);
		return null;
	}
	return frequency;
};

export const exractTermFromAnnotationBlock = (
	annotationBlock: DocumentJson,
): TermStatistic | null => {
	const term = getAnnotationTerm(annotationBlock);
	if (!term) {
		return null;
	}
	const frequency = getAnnotationFrequency(annotationBlock) || 0;

	return {
		term,
		frequency,
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
