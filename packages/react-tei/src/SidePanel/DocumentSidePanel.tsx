import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Close from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tooltip from "@mui/material/Tooltip";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useResizePanelOnScroll } from "../helper/useResizePanelOnScroll";
import { BibliographicReferencesSection } from "./bibliographicReferences/BibliographicReferencesSection";
import {
	TAB_ENRICHMENT,
	TAB_METADATA,
	useDocumentSidePanelContext,
} from "./DocumentSidePanelContext";
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
export const SIDEPANEL_PADDING = "40px";

export const DocumentSidePanel = ({
	ref,
	stickyTopOffset,
}: DocumentSidePanelprops) => {
	const asideRef = useRef<HTMLDivElement | null>(null);

	const { t } = useTranslation();
	useResizePanelOnScroll(asideRef);

	const {
		state: { isOpen, currentTab },
		enrichmentCount,
		selectTab,
		togglePanel,
	} = useDocumentSidePanelContext();

	const metadataSection = useMemo(() => {
		return (
			<>
				<KeywordSection />
				<SourceSection />
				<FootnotesSection />
				<BibliographicReferencesSection />
				<DocumentIdentifierSection />
			</>
		);
	}, []);

	const enrichmentSection = useMemo(() => {
		return (
			<>
				<EnrichmentTermSection />
				<MulticatCategories />
			</>
		);
	}, []);

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
					paddingInline: 4,
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
								marginInline: -4,
							}}
						>
							<ChevronLeft />
						</IconButton>
					</Tooltip>
				)}
			</Box>
			<Box
				sx={{
					paddingInline: 4,
					paddingBlockEnd: 2,
				}}
			>
				<Tabs
					value={currentTab}
					onChange={(_, newValue) => selectTab(newValue)}
					sx={{
						"& .MuiTab-root": {
							minHeight: 0,
							flexGrow: 1,
						},
					}}
				>
					<Tab
						label={t(`sidePanel.tabs.${TAB_METADATA}`)}
						aria-label={t(`sidePanel.tabs.${TAB_METADATA}`)}
						value={TAB_METADATA}
					/>
					<Tab
						label={
							<Tooltip
								title={t(`sidePanel.tabs.enrichmentTooltip`, {
									count: enrichmentCount,
								})}
								placement="top"
							>
								<span>
									{t(`sidePanel.tabs.${TAB_ENRICHMENT}`, {
										count: enrichmentCount,
									})}
								</span>
							</Tooltip>
						}
						aria-label={t(`sidePanel.tabs.${TAB_ENRICHMENT}`, {
							count: enrichmentCount,
						})}
						value={TAB_ENRICHMENT}
						disabled={enrichmentCount === 0}
					/>
				</Tabs>
			</Box>

			<Box
				sx={{
					flexGrow: 1,
					contain: "strict",
					overflowX: "hidden",
					overflowY: isOpen ? "auto" : "hidden",
					scrollbarWidth: "thin",
					paddingInline: 3,
				}}
				ref={ref}
				aria-hidden={!isOpen}
			>
				<TabPanel current={currentTab === TAB_METADATA}>
					{metadataSection}
				</TabPanel>

				<TabPanel current={currentTab === TAB_ENRICHMENT}>
					{enrichmentSection}
				</TabPanel>
			</Box>

			<Box
				sx={{
					background:
						"linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%)",
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 16,
					height: "2rem",
					pointerEvents: "none",
				}}
			/>
		</Paper>
	);
};

function TabPanel({
	children,
	current,
}: {
	children: React.ReactNode;
	current: boolean;
}) {
	return (
		<Stack
			sx={{
				width: `calc(${SIDEPANEL_WIDTH} - 32px)`,
				overflowX: "hidden",
				paddingBlockEnd: 4,
				"& .MuiList-root:not(.unstyled)": {
					listStyle: "disc",
					paddingInlineStart: "2.25rem",
				},
				display: current ? "flex" : "none",
			}}
			gap={3}
		>
			{children}
		</Stack>
	);
}
