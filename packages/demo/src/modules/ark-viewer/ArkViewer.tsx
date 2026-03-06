import { Viewer } from "@istex/react-tei/Viewer.js";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { useTranslation } from "react-i18next";
import {
	type LoaderFunction,
	useLoaderData,
	useRouteError,
} from "react-router";

export type ArkViewerLoaderData = {
	document: string | null;
	unitexEnrichment?: string | null;
	teeftEnrichment?: string | null;
	multicatEnrichment?: string | null;
	nbEnrichment?: string | null;
};

export const arkViewerLoader: LoaderFunction = async ({
	params,
}): Promise<ArkViewerLoaderData> => {
	const { ark } = params;
	if (!ark) {
		return {
			document: null,
		};
	}

	const metadata = await getDocumentInfo(ark);

	const promisePool = [
		getFulltext(metadata),
		getEnrichment(metadata, "unitex"),
		getEnrichment(metadata, "teeft"),
		getEnrichment(metadata, "multicat"),
		getEnrichment(metadata, "nb"),
	];
	const [fulltextResult, unitexResult, teeftResult, multicatResult, nbResult] =
		await Promise.allSettled(promisePool);

	return {
		document:
			fulltextResult?.status === "fulfilled" ? fulltextResult.value : null,
		unitexEnrichment:
			unitexResult?.status === "fulfilled" ? unitexResult.value : null,
		teeftEnrichment:
			teeftResult?.status === "fulfilled" ? teeftResult.value : null,
		multicatEnrichment:
			multicatResult?.status === "fulfilled" ? multicatResult.value : null,
		nbEnrichment: nbResult?.status === "fulfilled" ? nbResult.value : null,
	};
};

export function ArkViewer() {
	const { document, ...rest } = useLoaderData<ArkViewerLoaderData>();

	if (!document) {
		return <DocumentNotFound />;
	}

	return <Viewer document={document} stickyTopOffset={36} {...rest} />;
}

export function ErrorBoundary() {
	const error = useRouteError();
	if (!(error instanceof Error)) {
		return <div>Unknown error</div>;
	}

	return <div>{error.message}</div>;
}

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

async function getDocumentInfo(ark: string) {
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

async function getFulltext(result: DocumentInfo) {
	const info = result.fulltext?.find(
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

async function getEnrichment(
	result: DocumentInfo,
	enrichmentName: keyof NonNullable<DocumentInfo["enrichments"]>,
) {
	const info = result.enrichments?.[enrichmentName]?.find(
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

function DocumentNotFound() {
	const { t } = useTranslation();
	return (
		<Container
			maxWidth="sm"
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
				gap: 2,
				flexGrow: 1,
			}}
		>
			<Alert
				severity="warning"
				sx={{
					width: "100%",
				}}
			>
				{t("ark.documentNotFound")}
			</Alert>
		</Container>
	);
}
