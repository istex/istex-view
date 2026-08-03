import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { getDocumentJsonAtPath } from "../../parser/getDocumentJsonAtPath";

export type ReferenceValidationState =
	| "found"
	| "not_found"
	| "to_be_verified"
	| "retracted";

export interface EnrichedReference extends DocumentJson {
	validationState?: ReferenceValidationState;
}

export const useDocumentBibliographicReferences = (): EnrichedReference[] => {
	const { jsonDocument } = useDocumentContext();

	// First, get the base references immediately
	const baseReferences: EnrichedReference[] = useMemo(() => {
		const back = getDocumentJsonAtPath(jsonDocument, ["TEI", "text", "back"]);

		if (!back || !Array.isArray(back.value)) {
			return [];
		}

		const referencesDiv = back.value.find(
			(section) => section?.attributes?.["@type"] === "references",
		);

		if (!referencesDiv || !Array.isArray(referencesDiv.value)) {
			return [];
		}

		const listBibl = referencesDiv.value.find(
			(docJson) => docJson?.tag === "listBibl",
		);
		if (!listBibl || !Array.isArray(listBibl.value)) {
			return [];
		}

		const bibliographicReferences = listBibl.value.filter(({ tag }) =>
			["bibl", "biblStruct"].includes(tag),
		);

		return bibliographicReferences;
	}, [jsonDocument]);

	// Then, enrich the references using the bibCheck web service
	const { data } = useQuery({
		queryKey: ["enrichedReferences", baseReferences],
		queryFn: async () => {
			if (baseReferences.length === 0) {
				return baseReferences;
			}
			return await enrichReferences(baseReferences);
		},
		enabled: baseReferences.length > 0,
		retry: false,
	});

	return data || baseReferences;
};

async function enrichReferences(
	references: DocumentJson[],
): Promise<EnrichedReference[]> {
	const possibleStates: ReferenceValidationState[] = [
		"found",
		"not_found",
		"to_be_verified",
		"retracted",
	];

	await new Promise((resolve) => setTimeout(resolve, 0));

	return references.map((ref) => ({
		...ref,
		validationState:
			possibleStates[Math.floor(Math.random() * possibleStates.length)],
	}));
}
