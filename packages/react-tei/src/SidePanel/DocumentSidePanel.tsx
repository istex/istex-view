import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useResizePanelOnScroll } from "../helper/useResizePanelOnScroll";
import { AuthorSection } from "./authors/AuthorSection";
import { BibliographicReferencesSection } from "./bibliographicReferences/BibliographiceferencesSection";
import { useDocumentSidePanelContext } from "./DocumentSidePanelContext";
import { DocumentIdentifierSection } from "./documentIdentifier/DocumentIdentifierSection";
import { EnrichmentTermSection } from "./enrichmentTerm/EnrichmentTermSection";
import { FootnotesSection } from "./footNotes/FootnotesSection";
import { KeywordSection } from "./keywords/KeywordSection";
import { MulticatCategories } from "./multicat/MulticatCategories";
import { SourceSection } from "./source/SourceSection";

type DocumentSidePanelprops = {
	ref: React.RefObject<HTMLDivElement | null>;
	stickyTopOffset?: number;
};

export const SIDEPANEL_WIDTH = "512px";
const SIDEPANEL_PADDING = "40px";

export const DocumentSidePanel = ({
	ref,
	stickyTopOffset,
}: DocumentSidePanelprops) => {
	const asideRef = useRef<HTMLDivElement | null>(null);

	const { t } = useTranslation();
	useResizePanelOnScroll(asideRef);

	const {
		state: { isOpen },
		togglePanel,
	} = useDocumentSidePanelContext();

	return (
		<Paper
			elevation={0}
			sx={{
				height: "100%",
				width: isOpen ? SIDEPANEL_WIDTH : SIDEPANEL_PADDING,
				transition: "width 0.3s, height 0.1s",
				position: "sticky",
				top: stickyTopOffset ?? 0,
				display: {
					xs: "none",
					md: "flex",
				},
				flexDirection: "column",
				"& .MuiTypography-body1": {
					fontSize: "1rem",
				},
				paddingInline: 2,
				overflowX: "hidden",
			}}
			ref={asideRef}
		>
			<Box
				sx={{
					top: 0,
					backgroundColor: "background.paper",
					zIndex: 9,
					paddingBlock: 2,
				}}
			>
				{isOpen ? (
					<Button
						onClick={togglePanel}
						aria-label={t("sidePanel.close")}
						startIcon={<Close />}
						variant="text"
						size="small"
						fullWidth
						sx={{
							display: "flex",
						}}
					>
						{t("sidePanel.close")}
					</Button>
				) : (
					<Tooltip title={t("sidePanel.open")} placement="left">
						<IconButton
							onClick={togglePanel}
							aria-label={t("sidePanel.open")}
							sx={{
								marginInline: -2,
							}}
						>
							<ChevronLeft />
						</IconButton>
					</Tooltip>
				)}
			</Box>
			<Box
				sx={{
					flexGrow: 1,
					contain: "strict",
					overflowX: "hidden",
					overflowY: "auto",
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": {
						display: "none",
					},
				}}
				ref={ref}
			>
				<Stack
					sx={{
						width: `calc(${SIDEPANEL_WIDTH} - 32px)`,
						overflowX: "hidden",
						paddingBlockEnd: 4,
						"& .MuiList-root:not(.unstyled)": {
							listStyle: "disc",
							paddingInlineStart: "2.25rem",
						},
					}}
					gap={3}
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
			</Box>

			<Box
				sx={{
					background:
						"linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					height: "2rem",
					pointerEvents: "none",
				}}
			/>
		</Paper>
	);
};
