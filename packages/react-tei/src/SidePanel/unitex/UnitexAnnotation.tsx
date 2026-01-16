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
import { kebabCasify } from "../../helper/kebabCasify";
import { useDocumentNavigation } from "../../navigation/useNavigateToSection";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";

export function UnitexAnnotation({
	annotation,
	color,
	onToggle,
}: UnitexAnnotationProps) {
	const { t } = useTranslation();
	const { navigateToBodyTargetSelector } = useDocumentNavigation();

	const checkBoxLabel = t("unitex.toggleTerm", {
		context: annotation.displayed ? "hide" : "show",
		term: annotation.term,
	});

	const selector = `[data-term=${kebabCasify(annotation.term)}]`;

	const handleGoToPrevious = () => {
		navigateToBodyTargetSelector(selector, -1);
	};

	const handleGoToNext = () => {
		navigateToBodyTargetSelector(selector, 1);
	};

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
					onClick={handleGoToPrevious}
					aria-label={t("unitex.previous")}
				>
					<ArrowUpIcon />
				</IconButton>
				<IconButton
					size="small"
					disabled={!annotation.displayed}
					onClick={handleGoToNext}
					aria-label={t("unitex.next")}
				>
					<ArrowDownIcon />
				</IconButton>
			</Stack>
		</>
	);
}

type UnitexAnnotationProps = {
	annotation: TermStatistic;
	color?: string;
	onToggle: () => void;
};
