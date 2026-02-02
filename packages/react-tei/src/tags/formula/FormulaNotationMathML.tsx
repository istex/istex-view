import Typography from "@mui/material/Typography";
import { DebugTag } from "../../debug/DebugTag";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FormulaNotationMathML({ data }: ComponentProps) {
	const nestedFormulas = findChildrenByName(data, "formula");
	const id = data.attributes?.["@xml:id"];

	if (nestedFormulas.length > 1) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				payload={data}
				message="Multiple nested <formula> tags found inside <formula notation='mathml'> tag; rendering all content as-is"
			>
				<Value data={data.value} />
			</DebugTag>
		);
	}

	if (nestedFormulas.length === 1) {
		return (
			<Typography component="span" role="figure" id={id}>
				<Value data={nestedFormulas[0]?.value} />
			</Typography>
		);
	}

	return (
		<Typography component="span" role="figure" id={id}>
			<Value data={data.value} />
		</Typography>
	);
}
