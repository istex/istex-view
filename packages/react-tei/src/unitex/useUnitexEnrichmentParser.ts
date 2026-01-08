import { useMemo } from "react";
import { useDocumentParser } from "../parser/useDocumentParser";
import { parseUnitexEnrichment } from "./parseUnitexEnrichment";

export const useUnitexEnrichmentParser = (
	unitexEnrichment: string | null | undefined,
) => {
	const unitexEnrichmentJson = useDocumentParser(unitexEnrichment) ?? [];

	const parsedUnitexEnrichment = useMemo(() => {
		return parseUnitexEnrichment(unitexEnrichmentJson);
	}, [unitexEnrichmentJson]);

	return parsedUnitexEnrichment;
};
