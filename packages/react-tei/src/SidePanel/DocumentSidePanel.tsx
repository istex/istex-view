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
import { FootnotesSection } from "./footNotes/FootnotesSection";
import { KeywordSection } from "./keywords/KeywordSection";
import { SourceSection } from "./source/SourceSection";
import { UnitexSection } from "./unitex/UnitexSection";

type DocumentSidePanelprops = {
	ref: React.RefObject<HTMLDivElement | null>;
};

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
				width: isOpen ? "512px" : "40px",
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
				<Box width="40px" position="relative">
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
					width="472px"
					minWidth="472px"
					sx={{
						width: "472px",
						minWidth: "472px",
						paddingBlock: 4,
						paddingInlineEnd: 2,
						"& .MuiList-root": {
							listStyle: "disc",
							paddingLeft: "2.25rem",
							paddingRight: "2rem",
						},
					}}
					gap={4}
				>
					<AuthorSection />
					<KeywordSection />
					<SourceSection />
					<UnitexSection />
					<FootnotesSection />
					<BibliographicReferencesSection />
				</Stack>
			</Stack>
		</Paper>
	);
};
