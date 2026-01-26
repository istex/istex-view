import Box from "@mui/material/Box";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { footnotesTagCatalog } from "./footnotesTagCatalog";
import { useDocumentFootNotes } from "./useDocumentFootNotes";

export const FootnotesSection = memo(() => {
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
				<Box
					sx={{
						paddingInlineStart: 2,
						paddingInlineEnd: 4,
					}}
				>
					<Value data={footnotes} />
				</Box>
			</Accordion>
		</TagCatalogProvider>
	);
});
