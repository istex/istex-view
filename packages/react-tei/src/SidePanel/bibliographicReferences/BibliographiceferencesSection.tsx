import Stack from "@mui/material/Stack";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";
import { useDocumentBibliographicReferences } from "./useDocumentBibliographicReferences";

export const BibliographicReferencesSection = memo(() => {
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
				<Stack
					sx={{
						paddingInlineStart: 2,
						paddingInlineEnd: 4,
					}}
					gap={1}
				>
					<Value data={bibliographicReferences} />
				</Stack>
			</Accordion>
		</TagCatalogProvider>
	);
});
