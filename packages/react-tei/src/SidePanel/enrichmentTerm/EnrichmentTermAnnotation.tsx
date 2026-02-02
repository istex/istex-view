import ArrowDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowUpIcon from "@mui/icons-material/ArrowDropUp";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import type { TermStatistic } from "../../termEnrichment/parseUnitexEnrichment";
import { useEnrichmentAnnotationNavigation } from "./useEnrichmentAnnotationNavigation";

export function EnrichmentTermAnnotation({
	annotation,
	color,
	onToggle,
	count = 1,
}: EnrichmentTermAnnotationProps) {
	const { t } = useTranslation();

	const checkBoxLabel = t(`termEnrichment.toggleTerm`, {
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
				<Tooltip title={t(`termEnrichment.next`)} placement="top">
					<span>
						<IconButton
							size="small"
							disabled={!annotation.displayed}
							onClick={goToNext}
							aria-label={t(`termEnrichment.next`)}
						>
							<ArrowDownIcon />
						</IconButton>
					</span>
				</Tooltip>
				{count > 1 && (
					<Tooltip title={t(`termEnrichment.previous`)} placement="top">
						<span>
							<IconButton
								size="small"
								disabled={!annotation.displayed}
								onClick={goToPrevious}
								aria-label={t(`termEnrichment.previous`)}
							>
								<ArrowUpIcon />
							</IconButton>
						</span>
					</Tooltip>
				)}
			</Stack>
		</>
	);
}

type EnrichmentTermAnnotationProps = {
	annotation: TermStatistic;
	color?: string;
	count?: number;
	onToggle: () => void;
};
