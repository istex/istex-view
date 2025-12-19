import Typography from "@mui/material/Typography";
import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function Name({ data }: ComponentProps) {
	return (
		<Typography>
			<Value data={data.value} />
		</Typography>
	);
}
