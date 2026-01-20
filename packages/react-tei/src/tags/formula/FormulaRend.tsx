import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { FormulaRendDisplay } from "./FormulaRendDisplay";
import { FormulaRendInline } from "./FormulaRendInline";

export function FormulaRend({ data }: ComponentProps) {
	const rend = data.attributes?.["@rend"];
	switch (rend) {
		case "display":
			return <FormulaRendDisplay data={data} />;
		case "inline":
			return <FormulaRendInline data={data} />;
		default:
			return (
				<DebugTag
					tag={data.tag}
					attributes={data.attributes}
					payload={data}
					message="Unsupported rend attribute on <formula> tag"
				/>
			);
	}
}
