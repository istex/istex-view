import fs from "node:fs/promises";
import path from "node:path";
import type { Page } from "@playwright/test";

export interface MockIstexApiOptions {
	ark: string;
	documentFileName: string;
	unitexEnrichmentFileName?: string;
	teeftEnrichmentFileName?: string;
	multicatEnrichmentFileName?: string;
	nbEnrichmentFileName?: string;
}

const ISTEX_API_BASE_URL = "https://api.istex.fr";

export async function mockIstexApi(page: Page, options: MockIstexApiOptions) {
	const {
		ark,
		documentFileName,
		unitexEnrichmentFileName,
		teeftEnrichmentFileName,
		multicatEnrichmentFileName,
		nbEnrichmentFileName,
	} = options;

	const documentInfoUrl = new URL("/document", ISTEX_API_BASE_URL);
	documentInfoUrl.searchParams.set("q", `arkIstex.raw:"${ark}"`);
	documentInfoUrl.searchParams.set("output", "fulltext,enrichments");

	const getFulltextUrl = new URL(`/${ark}/fulltext.tei`, ISTEX_API_BASE_URL);

	const enrichmentsToMock = [
		{ name: "unitex", fileName: unitexEnrichmentFileName },
		{ name: "teeft", fileName: teeftEnrichmentFileName },
		{ name: "multicat", fileName: multicatEnrichmentFileName },
		{ name: "nb", fileName: nbEnrichmentFileName },
	]
		.filter((enrichment) => enrichment.fileName)
		.map((enrichment) => {
			return {
				...enrichment,
				url: new URL(
					`/${ark}/enrichments/${enrichment.name}`,
					ISTEX_API_BASE_URL,
				),
			};
		}) as { name: string; fileName: string; url: URL }[];

	const documentInfoResponse = {
		total: 1,
		hits: [
			{
				fulltext: [
					{
						mimetype: "application/tei+xml",
						uri: getFulltextUrl.toString(),
					},
				],
				enrichments: Object.fromEntries(
					enrichmentsToMock.map((enrichment) => [
						enrichment.name,
						[{ mimetype: "application/tei+xml", uri: enrichment.url }],
					]),
				),
			},
		],
	};

	await page.route(documentInfoUrl.toString(), async (route) => {
		await route.fulfill({ json: documentInfoResponse });
	});

	await page.route(getFulltextUrl.toString(), async (route) => {
		const body = await fs.readFile(
			path.join(import.meta.dirname, "..", "..", "testdata", documentFileName),
			"utf-8",
		);
		await route.fulfill({ body });
	});

	for (const enrichment of enrichmentsToMock) {
		await page.route(enrichment.url.toString(), async (route) => {
			const body = await fs.readFile(
				path.join(
					import.meta.dirname,
					"..",
					"..",
					"testdata",
					enrichment.fileName,
				),
				"utf-8",
			);
			await route.fulfill({ body });
		});
	}
}
