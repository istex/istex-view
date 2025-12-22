import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { footnotesTagCatalog } from "./footnotesTagCatalog";
import { useDocumentFootNotes } from "./useDocumentFootNotes";

export const FootnotesSection = () => {
	const footnotes = useDocumentFootNotes();

	if (!footnotes.length) {
		return null;
	}
	return (
		<TagCatalogProvider tagCatalog={footnotesTagCatalog}>
			<Accordion name="footnotes" label="sidePanel.footnotes.title">
				<Value data={footnotes} />
			</Accordion>
		</TagCatalogProvider>
	);
};
