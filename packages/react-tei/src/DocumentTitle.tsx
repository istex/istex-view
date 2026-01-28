import Typography from "@mui/material/Typography";
import { findTagByName } from "./helper/findTagByName";
import type { DocumentJson } from "./parser/document";
import { Value } from "./tags/Value";

type DocumentTitleProps = {
	teiHeader: DocumentJson;
};

export function DocumentTitle({ teiHeader }: DocumentTitleProps) {
	// We need to make sure we select the title from the titleStmt
	const titleStmt = findTagByName(teiHeader, "titleStmt");
	const title = findTagByName(titleStmt, "title");

	if (!title) {
		return null;
	}

	return (
		<Typography
			variant="h1"
			sx={{
				paddingInline: {
					xs: 2,
					md: 0,
				},
			}}
		>
			<Value data={title.value} />
		</Typography>
	);
}
