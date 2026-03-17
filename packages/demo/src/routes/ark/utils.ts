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

	// If getting the fulltext fails, we rethrow a different error so that
	// it can be displayed nicely in the UI
	try {
		return await getProtectedResource(info.uri);
	} catch {
		throw new NoFulltextError();
	}
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

	return await getProtectedResource(info.uri);
}

async function getProtectedResource(url: string) {
	const response = await fetch(url, {
		// Include the Istex API session cookie
		credentials: "include",

		// The API redirects to the login page when no session cookies are set.
		// We don't follow this redirect because we will set the current page (Istex View)
		// to this login page instead
		redirect: "manual",
	});
	if (!response.ok) {
		if (response.type === "opaqueredirect") {
			// When we get redirected, we craft the login page URL ourselves and set the callback
			// URL (target search param) to the current page (Istex View)
			const url = new URL("/authFede/", "https://api.istex.fr");
			url.searchParams.set("target", window.location.href);
			window.location.href = url.toString();
		} else {
			// If the response was not OK and was not a redirect, it's a real error
			const errorMessage = `Couldn't access the protected resource at '${url}', the API responded with status ${response.status}.`;
			console.error(errorMessage);
			throw new Error(errorMessage);
		}
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
