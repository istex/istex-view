import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FormulaRendDisplay({ data }: ComponentProps) {
	const mathMLFigure = useMemo(() => {
		const formulaChildren = findChildrenByName(data, "formula");

		return formulaChildren.find((figure) => {
			return (
				(!figure.attributes?.["@notation"] && !figure.attributes?.["@rend"]) ||
				figure.attributes?.["@notation"] === "mathml"
			);
		});
	}, [data]);

	if (!mathMLFigure) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				payload={data}
				message="Expected a <formula> without notation or rend attribute inside formula rend display"
			>
				<Value data={data.value} />
			</DebugTag>
		);
	}

	return (
		<Typography component="span" role="figure">
			<Value data={mathMLFigure.value} />
		</Typography>
	);
}
