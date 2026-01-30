import { Box, Stack, Tooltip } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { chipColors } from "../SidePanel/enrichmentTerm/enrichmentTermAnnotationBlocks";
import {
	useFormatHighlightValue,
	type useFormatHighlightValueParams,
} from "./enrichment/useFormatHighlightValue";
import { Value } from "./Value";

function HightlightCaption({ groups }: { groups: string[] }) {
	const { t } = useTranslation();
	return (
		<Stack direction="column" spacing={1}>
			{groups.map((group) => (
				<Stack key={group} direction="row" spacing={1} alignItems="center">
					<Box
						sx={{
							width: 24,
							height: 16,
							backgroundColor: chipColors[group as keyof typeof chipColors],
							border: (theme) => `1px solid ${theme.palette.divider}`,
						}}
					/>
					<Box>
						{t(`termEnrichment.${group}`, {
							count: 0,
						})}
					</Box>
				</Stack>
			))}
		</Stack>
	);
}

export const Highlight = ({ data }: HighlightProps) => {
	const { groups, displayedGroups, value } = useFormatHighlightValue({ data });
	const [tooltipOpen, setTooltipOpen] = useState(false);

	if (displayedGroups.length === 0) {
		return <Value data={value} />;
	}

	return (
		<Tooltip
			title={<HightlightCaption groups={displayedGroups} />}
			placement="top"
			slotProps={{
				tooltip: {
					sx: {
						backgroundColor: "white",
						color: "text.primary",
						padding: 2,
						border: (theme) => `1px solid ${theme.palette.divider}`,
					},
				},
			}}
			open={tooltipOpen}
		>
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
				onMouseOver={(e) => {
					e.stopPropagation();
					const target = e.target;
					if (!(target instanceof Element)) {
						return;
					}

					// enters delay is not support in controlled state tooltips, so we implement it manually
					setTimeout(() => {
						if (!target.matches(":hover")) {
							return;
						}

						setTooltipOpen(true);
					}, 500);
				}}
				onMouseOut={() => {
					setTooltipOpen(false);
				}}
			>
				<Value data={value} />
			</Box>
		</Tooltip>
	);
};

type HighlightProps = useFormatHighlightValueParams;
