import type { DocumentJson } from "../../parser/document";

export type ReferenceValidationStatus =
	| "found"
	| "not_found"
	| "to_be_verified"
	| "retracted";

export interface EnrichedReference extends DocumentJson {
	validationStatus?: ReferenceValidationStatus;
}

type BibCheckValidateResponse = {
	id: string;
	value: {
		status: ReferenceValidationStatus;
	};
}[];

export default async function enrichReferences(
	references: DocumentJson[],
): Promise<EnrichedReference[]> {
	// It is technically possible for a reference not to have an @xml:id attribute,
	// which means we can't find the corresponding DOM node and its text, so we
	// just don't send them to the web service.
	const payload = references
		.map((reference) => {
			const id = reference.attributes?.["@xml:id"];
			if (!id) {
				return null;
			}

			const text = document
				.querySelector<HTMLDivElement>(`#bibl-ref-${id}`)
				?.innerText.replace(/\s+/g, " ")
				.trim();
			if (!text) {
				return null;
			}

			return {
				id,
				value: text,
			};
		})
		.filter(Boolean);

	const url = new URL("/v1/validate", "https://biblio-ref.services.istex.fr");
	url.searchParams.set("sid", "istex-view");

	const response = await fetch(url, {
		method: "POST",
		body: JSON.stringify(payload),
	});
	if (!response.ok) {
		console.error(response);
		throw new Error("Error from bibCheck web service");
	}

	const responseBody = (await response.json()) as BibCheckValidateResponse;

	// We convert the response body, which is an array of objects with an id
	// property, to a Map with the id as key and the status as value. This
	// improves lookup time when inserting the status in the references.
	const responseMap = new Map<string, ReferenceValidationStatus>();
	responseBody.forEach((reference) => {
		responseMap.set(reference.id, reference.value.status);
	});

	return references.map((reference) => {
		// We use the id of the current reference to find the corresponding reference
		// in the web service response.
		const id = reference.attributes?.["@xml:id"];
		const validationStatus = id ? responseMap.get(id) : undefined;

		return {
			...reference,
			validationStatus,
		};
	});
}
