import Typography from "@mui/material/Typography";

import type { DocumentJson } from "../parser/document.js";
import { Value } from "./Value.js";

export function TableCaption({ id, label, title }: TableCaptionProps) {
	if (!label?.value && !title?.value) {
		return null;
	}

	return (
		<Typography component="caption" id={id}>
			{label?.value && (
				<Typography
					component="span"
					sx={{ fontWeight: "bold", marginRight: 1 }}
				>
					<Value data={label.value} />:{" "}
				</Typography>
			)}
			{title?.value && <Value data={title.value} />}
		</Typography>
	);
}

export type TableCaptionProps = {
	id: string;
	label?: DocumentJson;
	title?: DocumentJson;
};
