import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { footnotesTagCatalog } from "./footnotesTagCatalog";
import { useDocumentFootNotes } from "./useDocumentFootNotes";

export const FootnotesSection = () => {
	const { t } = useTranslation();
	const footnotes = useDocumentFootNotes();

	if (!footnotes.length) {
		return null;
	}
	return (
		<TagCatalogProvider tagCatalog={footnotesTagCatalog}>
			<Accordion
				name="footnotes"
				label={t("sidePanel.footnotes.title", { count: footnotes.length })}
			>
				<Value data={footnotes} />
			</Accordion>
		</TagCatalogProvider>
	);
};
