import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Paper, Stack } from "@mui/material";
import { useDocumentContext } from "../DocumentContextProvider.js";
import type { DocumentJson } from "../parser/document.js";
import { AuthorSection } from "./AuthorSection.js";

type DocumentDrawerProps = {
	teiHeader: DocumentJson;
};

export const DocumentSidePanel = (_props: DocumentDrawerProps) => {
	const {
		panel: {
			state: { isOpen },
			togglePanel,
		},
	} = useDocumentContext();
	return (
		<Paper
			elevation={2}
			sx={{
				width: isOpen ? "550px" : "40px",
				transition: "width 0.3s",
				overflow: "hidden",
			}}
		>
			<Stack direction="row">
				<Box width="40px">
					<IconButton onClick={togglePanel}>
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
