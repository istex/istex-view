import { Typography } from "@mui/material";
import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export const P = ({ data }: ComponentProps) => {
	return (
		<Typography variant="body1">
			<Value data={data.value ?? []} />
		</Typography>
	);
};
