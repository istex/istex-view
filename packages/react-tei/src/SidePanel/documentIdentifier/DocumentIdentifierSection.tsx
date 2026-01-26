import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import {
	TagCatalogProvider,
	useTagCatalog,
} from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { documentIdentifierTagCatalog } from "./documentIdentifierTagCatalog";
import { useDocumentIdentifiers } from "./useDocumentIdentifiers";

export const DocumentIdentifierSection = () => {
	const { t } = useTranslation();
	const documentIdentifiers = useDocumentIdentifiers();
	const tagCatalog = useTagCatalog();

	if (documentIdentifiers.length === 0) {
		return null;
	}

	return (
		<TagCatalogProvider
			tagCatalog={{ ...tagCatalog, ...documentIdentifierTagCatalog }}
		>
			<Accordion
				name="documentIdentifier"
				label={t("sidePanel.documentIdentifier.title")}
			>
				<Box
					sx={{
						paddingInlineStart: 2,
						paddingInlineEnd: 4,
					}}
				>
					<Value data={documentIdentifiers} />
				</Box>
			</Accordion>
		</TagCatalogProvider>
	);
};
