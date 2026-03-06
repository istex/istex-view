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
		throw new Error(`API responded with status ${response.status}`);
	}

	const body = (await response.json()) as IstexApiResponse;
	if (body.total === 0 || body.hits[0] == null) {
		throw new Error("Not found");
	}

	return body.hits[0];
}

export async function getFulltext(documentInfo: DocumentInfo) {
	const info = documentInfo.fulltext?.find(
		(fulltext) => fulltext.mimetype === "application/tei+xml",
	);
	if (!info) {
		throw new Error("No fulltext TEI");
	}

	const response = await fetch(info.uri);
	if (!response.ok) {
		throw new Error(`API responded with status ${response.status}`);
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
		throw new Error(`API responded with status ${response.status}`);
	}

	return await response.text();
}
