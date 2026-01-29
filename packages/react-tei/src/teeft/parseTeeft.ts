import { IS_DEBUG } from "../debug/debug.const";
import { findTagByName } from "../helper/findTagByName";
import type { DocumentJson } from "../parser/document";
import {
	getAnnotationTerm,
	type TermStatistic,
} from "../termEnrichment/parseUnitexEnrichment";

const extractTermFromTermTag = (
	termTag: DocumentJson,
): TermStatistic | null => {
	if (!Array.isArray(termTag.value)) {
		return null;
	}
	const term = getAnnotationTerm(termTag.value);

	if (!term) {
		return null;
	}

	return {
		term,
		displayed: true,
	};
};

export const parseTeeft = (
	teeftEnrichment: DocumentJson[] | null | undefined,
): TermStatistic[] => {
	if (!teeftEnrichment) {
		return [];
	}

	const teeftListAnnotation = findTagByName(
		teeftEnrichment,
		"ns1:listAnnotation",
	);

	if (!teeftListAnnotation || !Array.isArray(teeftListAnnotation.value)) {
		return [];
	}

	if (teeftListAnnotation.attributes?.["@type"] !== "rd-teeft") {
		IS_DEBUG &&
			console.warn("Unknown teeft listAnnotation type", teeftListAnnotation);
		return [];
	}

	const keywordsTag = findTagByName(teeftListAnnotation, "keywords");

	if (!keywordsTag || !Array.isArray(keywordsTag.value)) {
		return [];
	}

	const rootTerms = keywordsTag.value.filter((tag) => tag.tag === "term");

	if (!rootTerms.length) {
		return [];
	}

	const terms = rootTerms
		.map(extractTermFromTermTag)
		.filter((term): term is TermStatistic => term !== null);

	if (!terms?.length) {
		return [];
	}

	return terms;
};
