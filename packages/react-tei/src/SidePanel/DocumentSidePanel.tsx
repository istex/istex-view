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
				<Box width="40px" position="relative" top="1rem">
					<IconButton
						onClick={togglePanel}
						aria-label={isOpen ? t("sidePanel.close") : t("sidePanel.open")}
					>
						{isOpen ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</Box>
				<Box
					width="472px"
					minWidth="472px"
					sx={{
						"& .MuiList-root": {
							listStyle: "disc",
							paddingLeft: "2rem",
							paddingRight: "2rem",
						},
					}}
				>
					<AuthorSection />
					<KeywordSection />
					<SourceSection />
					<FootnotesSection />
					<BibliographicReferencesSection />
				</Box>
			</Stack>
		</Paper>
	);
};
