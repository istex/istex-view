import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { useDocumentSources } from "./useDocumentSources";

export const SourceSection = () => {
	const { t } = useTranslation();
	const documentSources = useDocumentSources();

	if (documentSources.length === 0) {
		return null;
	}

	return (
		<Accordion name="source" label={t("sidePanel.source.title")}>
			<Box
				sx={{
					paddingInlineStart: 2,
					paddingInlineEnd: 4,
				}}
			>
				<Value data={documentSources} />
			</Box>
		</Accordion>
	);
};
