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
			<Chip
				label={`${annotation.term} | ${annotation.frequency}`}
				style={{
					backgroundColor: annotation.displayed ? color : grey[600],
					color: "white",
					width: "fit-content",
				}}
				role="note"
			/>
		</>
	);
}

type UnitexAnnotationProps = {
	annotation: TermStatistic;
	color?: string;
	onToggle: () => void;
};
