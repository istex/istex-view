import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import {
	TagCatalogProvider,
	useTagCatalog,
} from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { sourceTagCatalog } from "./sourceTagCatalog";
import { useDocumentSources } from "./useDocumentSources";

export const SourceSection = () => {
	const { t } = useTranslation();
	const tagCatalog = useTagCatalog();
	const documentSources = useDocumentSources();

	if (documentSources.length === 0) {
		return null;
	}

	return (
		<TagCatalogProvider tagCatalog={{ ...tagCatalog, ...sourceTagCatalog }}>
			<Accordion name="source" label={t("sidePanel.source.title")}>
				<Box
					sx={{
						paddingInlineStart: 2,
						paddingInlineEnd: 4,
						"& .source-idno": { marginTop: 1 },
						"& .source-idno ~ .source-idno": { marginTop: 0 },
					}}
				>
					<Value data={documentSources} />
				</Box>
			</Accordion>
		</TagCatalogProvider>
	);
};
