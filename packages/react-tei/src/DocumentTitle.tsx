import Typography from "@mui/material/Typography";
import { findTagByName } from "./helper/findTagByName.js";
import type { DocumentJson } from "./parser/document.js";
import { Value } from "./tags/Value.js";

type DocumentTitleProps = {
	data: DocumentJson;
};

export function DocumentTitle({ data }: DocumentTitleProps) {
	// We need to make sure we select the title from the titleStmt
	const titleStmt = findTagByName(data, "titleStmt");
	const title = findTagByName(titleStmt, "title");

	if (!title) {
		return null;
	}

	return (
		<Typography variant="h1">
			<Value data={title.value} />
		</Typography>
	);
}
