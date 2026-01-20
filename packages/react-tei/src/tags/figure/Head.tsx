import Typography from "@mui/material/Typography";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function Head({ data }: ComponentProps) {
	return (
		<Typography variant="caption" fontWeight="bold" display="block">
			<Value data={data.value} />
		</Typography>
	);
}
