import Typography from "@mui/material/Typography";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FloatingTextHead({ data }: ComponentProps) {
	return (
		<Typography gutterBottom sx={{ fontWeight: "bold", display: "block" }}>
			<Value data={data.value} />
		</Typography>
	);
}
