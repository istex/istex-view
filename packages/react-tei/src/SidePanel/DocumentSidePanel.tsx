import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
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
				scrollbarWidth: "none",
				"&::-webkit-scrollbar": {
					display: "none",
				},
				"& .MuiTypography-body1": {
					fontSize: "1rem",
				},
				position: "relative",
			}}
			ref={ref}
		>
			<Stack
				sx={{
					position: "relative",
				}}
			>
				<Box
					sx={{
						position: "sticky",
						top: 0,
						backgroundColor: "background.paper",
						zIndex: 9,
						paddingBlock: 2,
					}}
				>
					<Button
						onClick={togglePanel}
						aria-label={t("sidePanel.close")}
						startIcon={<Close />}
						variant="text"
						size="small"
						fullWidth
						sx={{
							display: isOpen ? "flex" : "none",
							marginInline: 2,
						}}
					>
						{isOpen && t("sidePanel.close")}
					</Button>

					<Tooltip title={t("sidePanel.open")} placement="left">
						<IconButton
							onClick={togglePanel}
							aria-label={t("sidePanel.open")}
							sx={{
								display: isOpen ? "none" : "flex",
							}}
						>
							<ChevronLeft />
						</IconButton>
					</Tooltip>
				</Box>

				<Stack
					sx={{
						width: isOpen ? `${SIDEPANEL_WIDTH}px` : 0,
						minWidth: isOpen ? `${SIDEPANEL_WIDTH}px` : 0,
						opacity: isOpen ? 1 : 0,
						paddingBlockEnd: 4,
						paddingInlineEnd: 2,
						transition: "opacity 0.3s, width 0.3s, min-width 0.3s",
						"& .MuiList-root:not(.unstyled)": {
							listStyle: "disc",
							paddingInlineStart: "2.25rem",
							paddingInlineRight: "2rem",
						},
					}}
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

				<Box
					sx={{
						background:
							"linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
						position: "fixed",
						bottom: 0,
						left: 0,
						right: 0,
						height: "2rem",
						pointerEvents: "none",
					}}
				/>
			</Stack>
		</Paper>
	);
};
