import { Box } from "@mui/material";
import { chipColors } from "../SidePanel/unitex/unitexAnnotationBlocks";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Highlight = ({ data }: ComponentProps) => {
	const { value, attributes } = data;
	const groups = Array.isArray(attributes?.groups)
		? attributes?.groups
		: attributes?.groups
			? [attributes?.groups]
			: [];
	return (
		<Box
			component="span"
			data-term={attributes?.term}
			data-group={groups.join(" ")}
			sx={{
				boxShadow: groups
					.map((g, index) =>
						index === 0
							? `inset 0 -3px 0 ${chipColors[g as keyof typeof chipColors]}`
							: `0 ${index * 3}px 0 ${chipColors[g as keyof typeof chipColors]}`,
					)
					.join(", "),
			}}
		>
			<Value data={value} />
		</Box>
	);
};
