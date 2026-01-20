import Typography from "@mui/material/Typography";
import { DebugTag } from "../debug/DebugTag";
import { FormulaNotation } from "./formula/FormulaNotation";
import { FormulaRend } from "./formula/FormulaRend";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Formula({ data }: ComponentProps) {
	const notation = data.attributes?.["@notation"];
	const rend = data.attributes?.["@rend"];

	if (notation) {
		return <FormulaNotation data={data} />;
	}

	if (rend) {
		return <FormulaRend data={data} />;
	}

	return (
		<DebugTag
			tag={data.tag}
			attributes={data.attributes}
			payload={data}
			message={`No notation or rend attribute on <formula> tag, defaulting to value rendering inside figure`}
		>
			<Typography component="span" role="figure">
				<Value data={data.value} />
			</Typography>
		</DebugTag>
	);
}
