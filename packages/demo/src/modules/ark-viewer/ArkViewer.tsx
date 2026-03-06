import { Viewer } from "@istex/react-tei/Viewer.js";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { useTranslation } from "react-i18next";
import {
	type LoaderFunction,
	useLoaderData,
	useRouteError,
} from "react-router";
import { getDocumentInfo, getEnrichment, getFulltext } from "./utils";

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

	const documentInfo = await getDocumentInfo(ark);

	const promisePool = [
		getFulltext(documentInfo),
		getEnrichment(documentInfo, "unitex"),
		getEnrichment(documentInfo, "teeft"),
		getEnrichment(documentInfo, "multicat"),
		getEnrichment(documentInfo, "nb"),
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
