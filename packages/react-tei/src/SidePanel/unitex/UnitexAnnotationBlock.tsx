import Box from "@mui/material/Box";
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
	const annotations = useListUnitexAnnotationByBlockType(block);
	if (!annotations.length) {
		return null;
	}

	return (
		<Accordion
			name={`unitext_${block}` as PanelSection}
			label={t(`unitex.${block}`, { count: annotations.length })}
		>
			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "1fr",
					gridTemplateRows: "auto",
					columnGap: 0.5,
					rowGap: 1,
					paddingInlineStart: 2,
					paddingInlineEnd: 4,
				}}
				role="list"
				aria-label={t(`unitex.${block}`, { count: annotations.length })}
			>
				{annotations.map((annotation) => (
					<UnitexAnnotation
						key={annotation.term}
						annotation={annotation}
						color={color}
					/>
				))}
			</Box>
		</Accordion>
	);
}

type UnitexAnnotationBlockProps = {
	block: UnitexAnnotationBlockType;
};
