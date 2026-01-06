import { List } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";
import { useDocumentBibliographicReferences } from "./useDocumentBibliographicReferences";

export const BibliographicReferencesSection = () => {
	const { t } = useTranslation();
	const { bibliographicReferences, count } =
		useDocumentBibliographicReferences();
	if (count === 0) {
		return null;
	}

	return (
		<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
			<Accordion
				name="bibliographicReferences"
				label={t("sidePanel.bibliographicReferences.title", { count })}
			>
				<List dense>
					<Value data={bibliographicReferences} />
				</List>
			</Accordion>
		</TagCatalogProvider>
	);
};
