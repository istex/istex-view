import type { DocumentJson } from "../../parser/document";

export type ReferenceValidationState =
	| "found"
	| "not_found"
	| "to_be_verified"
	| "retracted";

export interface EnrichedReference extends DocumentJson {
	validationState?: ReferenceValidationState;
}

export default async function enrichReferences(
	references: DocumentJson[],
): Promise<EnrichedReference[]> {
	const possibleStates: ReferenceValidationState[] = [
		"found",
		"not_found",
		"to_be_verified",
		"retracted",
	];

	await new Promise((resolve) => setTimeout(resolve, 0));

	return references.map((reference) => ({
		...reference,
		validationState:
			possibleStates[Math.floor(Math.random() * possibleStates.length)],
	}));
}
