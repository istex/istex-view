import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";

export function useListTeeftAnnotation() {
	const { teeftEnrichment } = useDocumentContext();
	return useMemo(() => {
		const annotations = teeftEnrichment?.annotations ?? [];

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

			toggleAll() {
				return teeftEnrichment?.toggleAll();
			},
			toggleTerm(term: string) {
				return teeftEnrichment?.toggleTerm(term);
			},
		};
	}, [teeftEnrichment]);
}
