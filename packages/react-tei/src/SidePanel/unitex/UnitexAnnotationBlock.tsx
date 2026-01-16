import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useTranslation } from "react-i18next";
import type { PanelSection } from "../../DocumentContextProvider";
import { Accordion } from "../Accordion";
import { UnitexAnnotation } from "./UnitexAnnotation";
import {
	chipColors,
	type UnitexAnnotationBlockType,
} from "./unitexAnnotationBlocks";
import { useListUnitexAnnotationByBlockType } from "./useListUnitexAnnotationByBlockType";

export function UnitexAnnotationBlock({ block }: UnitexAnnotationBlockProps) {
	const { t } = useTranslation();

	const color = chipColors[block];
	const { annotations, displayStatus, toggleBlock, toggleTerm } =
		useListUnitexAnnotationByBlockType(block);

	const toggleContext = displayStatus === "all" ? "hide" : "show";
	const sectionlabel = t(`unitex.${block}`, { count: annotations.length });
	const checkboxLabel = t("unitex.toggleBlock", {
		context: toggleContext,
	});

	if (!annotations.length) {
		return null;
	}

	return (
		<Accordion
			name={`unitext_${block}` as PanelSection}
			label={t(`unitex.${block}`, { count: annotations.length })}
		>
			<Stack
				sx={{
					gap: 1,
					paddingInlineStart: 2,
					paddingInlineEnd: 4,
				}}
			>
				<FormControlLabel
					label={sectionlabel}
					control={
						<Tooltip title={checkboxLabel} placement="left">
							<Checkbox
								checked={displayStatus === "all"}
								indeterminate={displayStatus === "partial"}
								onChange={toggleBlock}
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
						gridTemplateColumns: "max-content 1fr max-content",
						gridTemplateRows: "auto",
						columnGap: 0.5,
						rowGap: 1,
						alignItems: "center",
						paddingInlineStart: 2.5,
						contain: "style paint inline-size",
					}}
					role="list"
					aria-label={t(`unitex.${block}`, { count: annotations.length })}
				>
					{annotations.map((annotation) => (
						<UnitexAnnotation
							key={annotation.term}
							annotation={annotation}
							color={color}
							onToggle={() => toggleTerm(annotation.term)}
						/>
					))}
				</Box>
			</Stack>
		</Accordion>
	);
}

type UnitexAnnotationBlockProps = {
	block: UnitexAnnotationBlockType;
};
