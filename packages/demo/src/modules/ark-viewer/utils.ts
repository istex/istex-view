interface FileInfo {
	mimetype: string;
	uri: string;
}

interface DocumentInfo {
	fulltext?: FileInfo[];
	enrichments?: {
		multicat?: FileInfo[];
		nb?: FileInfo[];
		teeft?: FileInfo[];
		unitex?: FileInfo[];
	};
}

interface IstexApiResponse {
	total: number;
	hits: DocumentInfo[];
}

export async function getDocumentInfo(ark: string) {
	const url = new URL("/document", "https://api.istex.fr");
	url.searchParams.set("q", `arkIstex.raw:"${ark}"`);
	url.searchParams.set("output", "fulltext,enrichments");

	const response = await fetch(url);
	if (!response.ok) {
		console.error(
			`Couldn't get the document info, the API responded with status ${response.status}.`,
		);
		throw new DocumentNotFoundError();
	}

	const body = (await response.json()) as IstexApiResponse;
	if (body.total === 0 || body.hits[0] == null) {
		console.error("Couldn't get the document info, the hits array is empty.");
		throw new DocumentNotFoundError();
	}

	return body.hits[0];
}

export async function getFulltext(documentInfo: DocumentInfo) {
	const info = documentInfo.fulltext?.find(
		(fulltext) => fulltext.mimetype === "application/tei+xml",
	);
	if (!info) {
		console.error(
			"Couldn't get the fulltext, the fulltext array has no entries with 'mimetype' set to 'application/tei+xml'.",
		);
		throw new NoFulltextError();
	}

	const response = await fetch(info.uri);
	if (!response.ok) {
		console.error(
			`Couldn't get the fulltext, the API responded with status ${response.status}.`,
		);
		throw new NoFulltextError();
	}

	return await response.text();
}

export async function getEnrichment(
	documentInfo: DocumentInfo,
	enrichmentName: keyof NonNullable<DocumentInfo["enrichments"]>,
) {
	const info = documentInfo.enrichments?.[enrichmentName]?.find(
		(enrichment) => enrichment.mimetype === "application/tei+xml",
	);
	if (!info) {
		throw new Error(`Enrichment ${enrichmentName} not found`);
	}

	const response = await fetch(info.uri);
	if (!response.ok) {
		console.error(
			`Couldn't get the ${enrichmentName} enrichment, the API responded with status ${response.status}.`,
		);
		throw new EnrichmentFetchingError(enrichmentName);
	}

	return await response.text();
}

export class TranslatedError extends Error {
	translationKey: string;
	translationData: Record<string, unknown> | undefined;

	constructor(
		translationKey: string,
		translationData?: Record<string, unknown>,
	) {
		super();
		this.translationKey = translationKey;
		this.translationData = translationData;
	}
}

export class DocumentNotFoundError extends TranslatedError {
	constructor() {
		super("errors.DocumentNotFoundError");
	}
}

export class NoFulltextError extends TranslatedError {
	constructor() {
		super("errors.NoFulltextError");
	}
}

export class EnrichmentFetchingError extends TranslatedError {
	constructor(enrichmentName: string) {
		super("errors.EnrichmentFetchingError", { enrichmentName });
	}
}
