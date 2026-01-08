import { Chip } from "@mui/material";
import type { TermStatistic } from "../../unitex/parseUnitexEnrichment";

export function UnitexAnnotation({ annotation, color }: UnitexAnnotationProps) {
	return (
		<Chip
			label={`${annotation.term} | ${annotation.frequency}`}
			style={{ backgroundColor: color, color: "white", width: "fit-content" }}
			role="note"
		/>
	);
}

type UnitexAnnotationProps = {
	annotation: TermStatistic;
	color?: string;
};
