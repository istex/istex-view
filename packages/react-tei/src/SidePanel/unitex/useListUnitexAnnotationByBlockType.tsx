import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { UnitexAnnotationBlockType } from "./unitexAnnotationBlocks";

export function useListUnitexAnnotationByBlockType(
	block: UnitexAnnotationBlockType,
) {
	const { unitexEnrichment } = useDocumentContext();
	return useMemo(() => {
		const annotations = unitexEnrichment?.document?.[block] ?? [];

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
				return unitexEnrichment?.toggleBlock(block);
			},
			toggleTerm(term: string) {
				return unitexEnrichment?.toggleTerm(block, term);
			},
		};
	}, [unitexEnrichment, block]);
}
