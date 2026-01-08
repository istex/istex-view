import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { UnitexAnnotationBlockType } from "./unitexAnnotationBlocks";

export function useListUnitexAnnotationByBlockType(
	block: UnitexAnnotationBlockType,
) {
	const { jsonUnitexEnrichment } = useDocumentContext();
	return useMemo(() => {
		return jsonUnitexEnrichment?.[block] ?? [];
	}, [jsonUnitexEnrichment, block]);
}
