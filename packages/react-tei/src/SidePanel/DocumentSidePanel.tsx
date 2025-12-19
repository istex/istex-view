import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { useTranslation } from "react-i18next";
import { useDocumentContext } from "../DocumentContextProvider.js";
import type { DocumentJson } from "../parser/document.js";
import { AuthorSection } from "./AuthorSection.js";

type DocumentDrawerProps = {
	teiHeader: DocumentJson;
};

export const DocumentSidePanel = (_props: DocumentDrawerProps) => {
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
				width: isOpen ? "550px" : "40px",
				transition: "width 0.3s",
				overflow: "hidden",
			}}
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
				<Box width="510px" minWidth="510px">
					<AuthorSection />
				</Box>
			</Stack>
		</Paper>
	);
};
