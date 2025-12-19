import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useDocumentContext } from "../DocumentContextProvider.js";
import { AuthorSection } from "./authors/AuthorSection.js";
import { KeywordSection } from "./keywords/KeywordSection.js";
import { SourceSection } from "./source/SourceSection.js";

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
				width: isOpen ? "384px" : "40px",
				transition: "width 0.3s",
				overflowX: "hidden",
				overflowY: "auto",
				display: {
					xs: "none",
					md: "block",
				},
			}}
			ref={ref}
		>
			<Stack direction="row">
				<Box width="40px">
					<IconButton
						onClick={togglePanel}
						aria-label={isOpen ? t("sidePanel.close") : t("sidePanel.open")}
					>
						{isOpen ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</Box>
				<Box width="344px" minWidth="344px">
					<AuthorSection />
					<KeywordSection />
					<SourceSection />
				</Box>
			</Stack>
		</Paper>
	);
};
