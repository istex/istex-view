import { Box } from "@mui/material";
import { chipColors } from "../SidePanel/unitex/unitexAnnotationBlocks";
import type { ComponentProps } from "./type";

export const Highlight = ({ data }: ComponentProps) => {
	const { value, attributes } = data;
	if (typeof value !== "string") {
		console.warn("Highlight tag value is not a string:", data.value);
		return null;
	}
	return (
		<Box
			component="span"
			data-term={attributes?.term}
			data-group={attributes?.group}
			sx={{
				borderBottom: "3px solid",
				borderColor:
					chipColors[attributes?.group as keyof typeof chipColors] || "gray",
			}}
		>
			{value}
		</Box>
	);
};
