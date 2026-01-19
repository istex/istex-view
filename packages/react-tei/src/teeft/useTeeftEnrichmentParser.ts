import { useMemo } from "react";
import { useDocumentParser } from "../parser/useDocumentParser";
import { parseTeeft } from "./parseTeeft";

export const useTeeftEnrichmentParser = (
	unitexEnrichment: string | null | undefined,
) => {
	const unitexEnrichmentJson = useDocumentParser(unitexEnrichment) ?? [];

	const parsedUnitexEnrichment = useMemo(() => {
		return parseTeeft(unitexEnrichmentJson);
	}, [unitexEnrichmentJson]);

	return parsedUnitexEnrichment;
};
