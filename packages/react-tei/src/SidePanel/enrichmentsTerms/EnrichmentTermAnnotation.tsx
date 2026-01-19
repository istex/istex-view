import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";
import { useEnrichmentAnnotationNavigation } from "./useEnrichmentAnnotationNavigation";

export function EnrichmentTermAnnotation({
	annotation,
	color,
	onToggle,
	enrichment,
}: EnrichmentTermAnnotationProps) {
	const { t } = useTranslation();

	const checkBoxLabel = t(`${enrichment}.toggleTerm`, {
		context: annotation.displayed ? "hide" : "show",
		term: annotation.term,
	});

	const { goToNext, goToPrevious } = useEnrichmentAnnotationNavigation(
		annotation.term,
	);

	return (
		<>
			<Tooltip title={checkBoxLabel} placement="left">
				<Checkbox
					checked={annotation.displayed}
					sx={{
						padding: 1,
					}}
					onChange={() => onToggle()}
					slotProps={{
						input: {
							"aria-label": checkBoxLabel,
						},
					}}
				/>
			</Tooltip>
			<Box
				sx={{
					flexGrow: 1,
					contain: "style paint inline-size",
				}}
			>
				<Tooltip
					title={annotation.term}
					placement="left"
					slotProps={{
						popper: {
							sx: {
								marginRight: "44px !important",
							},
						},
					}}
				>
					<Chip
						label={annotation.term}
						role="note"
						slotProps={{
							root: {
								sx: {
									backgroundColor: annotation.displayed ? color : grey[100],
									color: "black",
								},
							},
						}}
					/>
				</Tooltip>
			</Box>
			<Stack gap={0.5} direction="row">
				<IconButton
					size="small"
					disabled={!annotation.displayed}
					onClick={goToPrevious}
					aria-label={t(`${enrichment}.previous`)}
				>
					<ArrowUpIcon />
				</IconButton>
				<IconButton
					size="small"
					disabled={!annotation.displayed}
					onClick={goToNext}
					aria-label={t(`${enrichment}.next`)}
				>
					<ArrowDownIcon />
				</IconButton>
			</Stack>
		</>
	);
}

type EnrichmentTermAnnotationProps = {
	annotation: TermStatistic;
	enrichment: "unitex" | "teeft";
	color?: string;
	onToggle: () => void;
};
