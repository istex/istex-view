import Typography from "@mui/material/Typography";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FormulaRendInline({ data }: ComponentProps) {
	return (
		<Typography component="span" role="figure">
			<Value data={data.value} />
		</Typography>
	);
}
