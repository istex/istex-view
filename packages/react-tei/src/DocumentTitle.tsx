import { Typography } from "@mui/material";
import type { DocumentJson } from "./parser/document.js";
import { Value } from "./tags/Value.js";

type DocumentTitleProps = {
	data: DocumentJson;
};

export function DocumentTitle({ data: { value } }: DocumentTitleProps) {
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
	if (!title) {
		console.warn("teiHeader missing title or invalid value:", titleStmt);
		return null;
	}

	return (
		<Typography variant="h1" sx={{ margin: 8 }}>
			<Value data={title.value} />
		</Typography>
	);
}
