import Box, { type BoxProps } from "@mui/material/Box";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";
import { useDocumentBibliographicReferences } from "./useDocumentBibliographicReferences";

export const bibliographicReferenceSectionSx: BoxProps["sx"] = {
	display: "grid",
	gridTemplateColumns: "1fr max-content",
	columnGap: 0.5,
	rowGap: 1,
	paddingInline: 2,
};

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
				<Box sx={bibliographicReferenceSectionSx}>
					<Value data={bibliographicReferences} />
				</Box>
			</Accordion>
		</TagCatalogProvider>
	);
});
