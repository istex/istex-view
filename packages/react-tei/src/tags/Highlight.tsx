import { Box } from "@mui/material";
import type { ComponentProps } from "./type";

export const Highlight = ({ data }: ComponentProps) => {
	if (typeof data.value !== "string") {
		console.warn("Highlight tag value is not a string:", data.value);
		return null;
	}
	return (
		<Box
			component="span"
			data-term={data.attributes?.term}
			data-group={data.attributes?.group}
			sx={{
				borderBottom: "1px solid red", // Todo customize style based on group
			}}
		>
			{data.value}
		</Box>
	);
};
