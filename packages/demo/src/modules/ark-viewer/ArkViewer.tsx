import { Viewer } from "@istex/react-tei/Viewer.js";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { useTranslation } from "react-i18next";
import { type LoaderFunction, useLoaderData } from "react-router";
import document from "./document/minimal.tei.xml?raw";
import unitexEnrichment from "./document/minimal.unitex.xml?raw";

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
	const { id } = params;

	// Simulate loading time
	await new Promise((resolve) => setTimeout(resolve, 1000));

	if (!id) {
		return {
			document: null,
		};
	}

	return {
		document,
		unitexEnrichment,
	};
};

export function ArkViewer() {
	const { document, ...rest } = useLoaderData<ArkViewerLoaderData>();

	if (!document) {
		return <DocumentNotFound />;
	}

	return (
		<Viewer
			document={document}
			{...rest}
			height="calc(100dvh - 49.5px - 118.5px)"
		/>
	);
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
			<Button
				component={Link}
				href="https://search.istex.fr/fr-FR"
				fullWidth
				variant="contained"
				startIcon={<KeyboardBackspaceIcon />}
			>
				{t("ark.goToIstexSearch")}
			</Button>
		</Container>
	);
}
