import { Box, Typography } from "@mui/material";
import type { DocumentJson } from "../parser/document.js";

type TeiHeaderProps = {
	data: DocumentJson;
};

export const TeiHeader = ({ data: { value } }: TeiHeaderProps) => {
	if (!Array.isArray(value)) {
		console.warn("teiHeader with non-array value:", value);
		return null;
	}

	const fileDesc = value.find(({ tag }) => tag === "fileDesc");
	if (!fileDesc || !Array.isArray(fileDesc.value)) {
		console.warn("teiHeader missing fileDesc or invalid value:", fileDesc);
		return null;
	}

	const titleStmt = fileDesc.value.find(({ tag }) => tag === "titleStmt");
	if (!titleStmt || !Array.isArray(titleStmt.value)) {
		console.warn("teiHeader missing titleStmt or invalid value:", titleStmt);
		return null;
	}

	const title = titleStmt.value.find(({ tag }) => tag === "title");
	if (!title || !Array.isArray(title.value)) {
		console.warn("teiHeader missing title or invalid value:", titleStmt);
		return null;
	}

	const titleText = title.value.find(({ tag }) => tag === "#text");
	if (typeof titleText?.value !== "string") {
		console.warn("teiHeader missing titleText or invalid value:", titleText);
		return null;
	}

	return (
		<Box sx={{ margin: 8 }}>
			<Typography variant="h1">{titleText.value}</Typography>
		</Box>
	);
};
