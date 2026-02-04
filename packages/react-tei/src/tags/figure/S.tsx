import { Box } from "@mui/material";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export const S = ({ data }: ComponentProps) => {
	return (
		<Box component="span" sx={{ display: "block" }}>
			<Value data={data.value} />
		</Box>
	);
};
