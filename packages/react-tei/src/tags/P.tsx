import { Typography } from "@mui/material";
import type { DocumentJson } from "../parser/document.js";
import { Value } from "./Value.js";

export const P = ({
	data,
}: {
	data: {
		value: DocumentJson[];
	};
}) => {
	return (
		<Typography variant="body1">
			<Value data={data.value ?? []} />
		</Typography>
	);
};
