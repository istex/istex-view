import { Box } from "@mui/material";
import type { DocumentJson } from "../parser/document";
import { chipColors } from "../SidePanel/unitex/unitexAnnotationBlocks";
import { Value } from "./Value";

export const Highlight = ({
	data,
}: {
	data: {
		tag: "highlight";
		attributes: {
			term: string;
			group: string[];
		};
		value: string | DocumentJson[];
	};
}) => {
	const { value, attributes } = data;
	return (
		<Box
			component="span"
			data-term={attributes?.term}
			data-group={attributes?.group.join(" ")}
			sx={{
				boxShadow: attributes.group
					.map((g, index) =>
						index === 0
							? `inset 0 -3px 0 ${chipColors[g as keyof typeof chipColors]}`
							: `0 ${(index + 1) * 3}px 0 ${chipColors[g as keyof typeof chipColors]}`,
					)
					.join(", "),
			}}
		>
			<Value data={value} />
		</Box>
	);
};
