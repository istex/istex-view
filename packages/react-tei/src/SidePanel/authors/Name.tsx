import { Typography } from "@mui/material";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export function Name({ data }: ComponentProps) {
	return (
		<Typography>
			<Value data={data.value} />
		</Typography>
	);
}
