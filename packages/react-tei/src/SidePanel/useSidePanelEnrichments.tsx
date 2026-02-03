import { useMemo } from "react";
import { useDocumentContext } from "../DocumentContextProvider";

export const TERM_ENRICHMENT_SECTIONS = [
	"date",
	"orgName",
	"orgNameFunder",
	"orgNameProvider",
	"refBibl",
	"refUrl",
	"persName",
	"placeName",
	"geogName",
	"teeft",
] as const;

export const MULTICAT_SECTIONS = [
	"inist",
	"wos",
	"science_metrix",
	"scopus",
] as const;

export function useSidePanelEnrichments() {
	const { multicatEnrichment, termEnrichment } = useDocumentContext();

	const enrichmentCount = useMemo(() => {
		return (
			Object.values(termEnrichment?.termCountByGroup ?? {}).filter(
				(group) => Object.keys(group).length > 0,
			).length + multicatEnrichment.length
		);
	}, [multicatEnrichment, termEnrichment]);

	const openEnrichment = useMemo(() => {
		for (const section of TERM_ENRICHMENT_SECTIONS) {
			if (
				Object.keys(termEnrichment?.termCountByGroup[section] ?? {}).length > 0
			) {
				return `termEnrichment_${section}`;
			}
		}

		for (const section of MULTICAT_SECTIONS) {
			if (multicatEnrichment.find((category) => category.scheme === section)) {
				return `multicat_${section}`;
			}
		}
	}, [multicatEnrichment, termEnrichment]);

	return useMemo(
		() => ({
			enrichmentCount,
			openEnrichment,
		}),
		[enrichmentCount, openEnrichment],
	);
}
