import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { useDocumentBibliographicReferences } from "./useDocumentBibliographicReferences";

export const BibliographicReferencesSection = () => {
	const { t } = useTranslation();
	const { bibliographicReferences, count } =
		useDocumentBibliographicReferences();

	if (count === 0) {
		return null;
	}

	return (
		<TagCatalogProvider tagCatalog={{}}>
			<Accordion
				name="bibliographicReferences"
				label={t("sidePanel.bibliographicReferences.title", { count })}
			>
				<Value data={bibliographicReferences} />
			</Accordion>
		</TagCatalogProvider>
	);
};
