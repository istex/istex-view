import Typography from "@mui/material/Typography";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FloatingTextHead({ data }: ComponentProps) {
	return (
		<Typography fontWeight="bold" display="block" gutterBottom>
			<Value data={data.value} />
		</Typography>
	);
}
