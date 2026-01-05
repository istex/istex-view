import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Value } from "../../tags/Value.js";
import { Accordion } from "../Accordion.js";
import { useDocumentSources } from "./useDocumentSources.js";

export const SourceSection = () => {
	const { t } = useTranslation();
	const documentSources = useDocumentSources();

	if (documentSources.length === 0) {
		return null;
	}

	return (
		<Accordion name="source" label={t("sidePanel.source.title")}>
			<Typography>
				<Value data={documentSources} />
			</Typography>
		</Accordion>
	);
};
