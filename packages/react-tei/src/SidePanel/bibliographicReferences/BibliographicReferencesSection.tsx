import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Link, Tooltip } from "@mui/material";
import Box, { type BoxProps } from "@mui/material/Box";
import { type MouseEventHandler, memo } from "react";
import { Trans, useTranslation } from "react-i18next";
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
	const bibliographicReferences = useDocumentBibliographicReferences();

	// References have been enriched if at least one of them has a validationStatus
	const enriched = bibliographicReferences.some(
		(reference) => reference.validationStatus != null,
	);

	if (bibliographicReferences.length === 0) {
		return null;
	}

	const stopPropagation: MouseEventHandler = (event) => {
		event.stopPropagation();
	};

	return (
		<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
			<Accordion
				name="bibliographicReferences"
				label={
					<Box sx={{ display: "flex", alignItems: "center" }}>
						{t("sidePanel.bibliographicReferences.title", {
							count: bibliographicReferences.length,
						})}

						{enriched && (
							<Tooltip
								title={
									<Trans
										i18nKey="sidePanel.bibliographicReferences.tooltip"
										components={{
											bibCheckLink: (
												<Link
													color="inherit"
													href="https://services.istex.fr/validation-de-reference-bibliographique/"
													target="_blank"
													rel="noopener"
												/>
											),
										}}
									/>
								}
								slotProps={{ popper: { onClick: stopPropagation } }}
								onClick={stopPropagation}
								sx={{ ml: 1 }}
							>
								<InfoOutlinedIcon fontSize="small" />
							</Tooltip>
						)}
					</Box>
				}
			>
				<Box sx={bibliographicReferenceSectionSx}>
					<Value data={bibliographicReferences} />
				</Box>
			</Accordion>
		</TagCatalogProvider>
	);
});
