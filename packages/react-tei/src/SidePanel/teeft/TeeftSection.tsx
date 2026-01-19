import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import type { PanelSection } from "../../DocumentContextProvider";
import { Accordion } from "../Accordion";
import { UnitexAnnotation } from "../unitex/UnitexAnnotation";
import { useListTeeftAnnotation } from "./useListTeeftAnnotation";

export const TEEFT_COLOR = "#C7C0FD";

export function TeeftSection() {
	const { t } = useTranslation();

	const { annotations, displayStatus, toggleAll, toggleTerm } =
		useListTeeftAnnotation();

	const checkboxLabel = t("teeft.toggleAll", {
		context: displayStatus === "all" ? "hide" : "show",
	});

	if (!annotations.length) {
		return null;
	}

	return (
		<Accordion
			name={`teeft` as PanelSection}
			label={t("teeft.block", { count: annotations.length })}
		>
			<Stack
				sx={{
					gap: 1,
					paddingInlineStart: 2,
					paddingInlineEnd: 4,
				}}
			>
				<FormControlLabel
					label={checkboxLabel}
					control={
						<Tooltip title={checkboxLabel} placement="left">
							<Checkbox
								checked={displayStatus === "all"}
								indeterminate={displayStatus === "partial"}
								onChange={toggleAll}
								slotProps={{
									input: {
										"aria-label": checkboxLabel,
										...(displayStatus === "partial"
											? {
													"aria-checked": "mixed",
												}
											: undefined),
									},
								}}
							/>
						</Tooltip>
					}
				/>

				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "max-content 1fr",
						gridTemplateRows: "auto",
						columnGap: 0.5,
						rowGap: 1,
						alignItems: "center",
						paddingInlineStart: 2.5,
						contain: "style paint inline-size",
					}}
					role="list"
					aria-label={t(`teeft.toggleTerm`, { count: annotations.length })}
				>
					{annotations.map((annotation) => (
						<UnitexAnnotation
							key={annotation.term}
							annotation={annotation}
							color={TEEFT_COLOR}
							onToggle={() => toggleTerm(annotation.term)}
						/>
					))}
				</Box>
			</Stack>
		</Accordion>
	);
}
