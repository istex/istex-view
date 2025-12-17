import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, IconButton, Paper, Stack } from "@mui/material";
import { useState } from "react";
import type { DocumentJson } from "./parser/document.js";

type DocumentDrawerProps = {
	teiHeader: DocumentJson;
};

export const DocumentSidePanel = (_props: DocumentDrawerProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Paper
			elevation={2}
			sx={{
				width: open ? "550px" : "40px",
				transition: "width 0.3s",
				overflow: "hidden",
			}}
		>
			<Stack direction="row">
				<Box width="40px">
					<IconButton onClick={() => setOpen((prev) => !prev)}>
						{open ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</Box>
				<Box width="510px" minWidth="510px">
					Placeholder
				</Box>
			</Stack>
		</Paper>
	);
};
