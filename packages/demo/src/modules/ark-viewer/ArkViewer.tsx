import { Viewer } from "@istex/react-tei/Viewer.js";
import { useTranslation } from "react-i18next";
import {
	type LoaderFunction,
	useLoaderData,
	useRouteError,
} from "react-router";
import {
	getDocumentInfo,
	getEnrichment,
	getFulltext,
	TranslatedError,
} from "./utils";

export type ArkViewerLoaderData = {
	document: string;
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
		throw new Error("Missing ARK, this should not happen.");
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

	// Errors while getting the fulltext are considered fatal so we rethrow them
	if (fulltextResult?.status === "rejected") {
		throw fulltextResult.reason;
	}

	return {
		document: fulltextResult?.value ?? "",
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
	const data = useLoaderData<ArkViewerLoaderData>();

	return <Viewer stickyTopOffset={36} {...data} />;
}

export function ErrorBoundary() {
	const { t } = useTranslation();
	const error = useRouteError();

	if (!(error instanceof Error)) {
		return <div>Unknown error</div>;
	}

	if (error instanceof TranslatedError) {
		return <div>{t(error.translationKey, error.translationData)}</div>;
	}

	return <div>{error.message}</div>;
}
