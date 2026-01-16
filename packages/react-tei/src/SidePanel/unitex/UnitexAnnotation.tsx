import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { grey } from "@mui/material/colors";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";

export function UnitexAnnotation({
	annotation,
	color,
	onToggle,
}: UnitexAnnotationProps) {
	const { t } = useTranslation();

	const checkBoxLabel = t("unitex.toggleTerm", {
		context: annotation.displayed ? "hide" : "show",
		term: annotation.term,
	});

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
									backgroundColor: annotation.displayed ? color : grey[600],
									color: "white",
								},
							},
						}}
					/>
				</Tooltip>
			</Box>
		</>
	);
}

type UnitexAnnotationProps = {
	annotation: TermStatistic;
	color?: string;
	onToggle: () => void;
};
