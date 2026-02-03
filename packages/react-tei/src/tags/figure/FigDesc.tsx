import { Typography } from "@mui/material";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FigDesc({ data }: ComponentProps) {
	return (
		<Typography component="p" variant="caption">
			<Value data={data.value} />
		</Typography>
	);
}
