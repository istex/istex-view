import { Box } from "@mui/material";
import { chipColors } from "../SidePanel/enrichmentTerm/enrichmentTermAnnotationBlocks";
import {
	useFormatHighlightValue,
	type useFormatHighlightValueParams,
} from "./enrichment/useFormatHighlightValue";
import { Value } from "./Value";

export const Highlight = ({ data }: HighlightProps) => {
	const { groups, displayedGroups, value } = useFormatHighlightValue({ data });

	if (displayedGroups.length === 0) {
		return <Value data={value} />;
	}

	return (
		<Box
			component="mark"
			data-term={data?.attributes?.term}
			data-group={groups.join(" ")}
			data-underlined-group={displayedGroups.join(" ")}
			role="mark"
			sx={{
				color: "inherit",
				backgroundColor: "transparent",
			}}
			style={{
				boxShadow: displayedGroups
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

type HighlightProps = useFormatHighlightValueParams;
