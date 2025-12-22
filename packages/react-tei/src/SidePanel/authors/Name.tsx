import { Typography } from "@mui/material";
import type { ComponentProps } from "../../tags/type.js";
import { Value } from "../../tags/Value.js";

export function Name({ data }: ComponentProps) {
	return (
		<Typography>
			<Value data={data.value} />
		</Typography>
	);
}
