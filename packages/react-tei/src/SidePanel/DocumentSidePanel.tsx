import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useDocumentContext } from "../DocumentContextProvider";
import { AuthorSection } from "./authors/AuthorSection";
import { BibliographicReferencesSection } from "./bibliographicReferences/BibliographiceferencesSection";
import { DocumentIdentifierSection } from "./documentIdentifier/DocumentIdentifierSection";
import { EnrichmentTermSection } from "./enrichmentTerm/EnrichmentTermSection";
import { FootnotesSection } from "./footNotes/FootnotesSection";
import { KeywordSection } from "./keywords/KeywordSection";
import { MulticatCategories } from "./multicat/MulticatCategories";
import { SourceSection } from "./source/SourceSection";

type DocumentSidePanelprops = {
	ref: React.RefObject<HTMLDivElement | null>;
};

export const SIDEPANEL_WIDTH = "512px";
const SIDEPANEL_PADDING = "40px";

export const DocumentSidePanel = ({ ref }: DocumentSidePanelprops) => {
	const { t } = useTranslation();
	const {
		panel: {
			state: { isOpen },
			togglePanel,
		},
	} = useDocumentContext();

	return (
		<Paper
			elevation={0}
			sx={{
				width: isOpen ? SIDEPANEL_WIDTH : SIDEPANEL_PADDING,
				transition: "width 0.3s",
				overflowX: "hidden",
				overflowY: "auto",
				display: {
					xs: "none",
					md: "block",
				},
				"& .MuiTypography-body1": {
					fontSize: "1rem",
				},
			}}
			ref={ref}
		>
			<Stack direction="row">
				<Box width={SIDEPANEL_PADDING} position="relative">
					<IconButton
						onClick={togglePanel}
						aria-label={isOpen ? t("sidePanel.close") : t("sidePanel.open")}
						sx={{
							position: "sticky",
							top: "0.5rem",
						}}
					>
						{isOpen ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</Box>
				<Stack
					sx={{
						width: `calc(${SIDEPANEL_WIDTH} - ${SIDEPANEL_PADDING})`,
						minWidth: `calc(${SIDEPANEL_WIDTH} - ${SIDEPANEL_PADDING})`,
						paddingBlock: 4,
						paddingInlineEnd: 2,
						"& .MuiList-root:not(.unstyled)": {
							listStyle: "disc",
							paddingInlineStart: "2.25rem",
							paddingInlineRight: "2rem",
						},
					}}
					gap={4}
				>
					<AuthorSection />
					<KeywordSection />
					<SourceSection />
					<EnrichmentTermSection />
					<MulticatCategories />
					<FootnotesSection />
					<BibliographicReferencesSection />
					<DocumentIdentifierSection />
				</Stack>
			</Stack>
		</Paper>
	);
};
