import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { EnrichmentTermAnnotationBlockType } from "./enrichmentTermAnnotationBlocks";

export function useListEnrichmentTermAnnotationByBlockType(
	block: EnrichmentTermAnnotationBlockType,
) {
	const { termEnrichment } = useDocumentContext();
	return useMemo(() => {
		const annotations = termEnrichment?.document?.[block] ?? [];

		const displayedStatus = annotations.reduce<{
			someDisplayed: boolean;
			someHidden: boolean;
		}>(
			(acc, annotation) => {
				if (annotation.displayed) {
					acc.someDisplayed = true;
				} else {
					acc.someHidden = true;
				}
				return acc;
			},
			{ someDisplayed: false, someHidden: false },
		);
		return {
			annotations,

			displayStatus:
				displayedStatus.someDisplayed && displayedStatus.someHidden
					? "partial"
					: displayedStatus.someDisplayed
						? "all"
						: "none",

			toggleBlock() {
				return termEnrichment?.toggleBlock(block);
			},
			toggleTerm(term: string) {
				return termEnrichment?.toggleTerm(block, term);
			},
		};
	}, [termEnrichment, block]);
}
