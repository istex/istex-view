import Box from "@mui/material/Box";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Lg = ({ data }: ComponentProps) => {
	return (
		<Box
			component="blockquote"
			sx={{
				width: "fit-content",
				margin: "auto",
			}}
		>
			<Value data={data.value} />
		</Box>
	);
};
