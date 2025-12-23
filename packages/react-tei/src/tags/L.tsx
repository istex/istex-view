import { Typography } from "@mui/material";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const L = ({ data }: ComponentProps) => {
	return (
		<Typography>
			<Value data={data.value} />
		</Typography>
	);
};
