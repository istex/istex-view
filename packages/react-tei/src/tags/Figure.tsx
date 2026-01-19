import { DebugTag } from "../debug/DebugTag";
import { FigureTable } from "./figure/FigureTable";
import type { ComponentProps } from "./type";

export function Figure({ data }: ComponentProps) {
	const type = data.attributes?.["@type"];

	switch (type) {
		case "table":
			return <FigureTable data={data} />;
		default:
			return (
				<DebugTag
					tag={data.tag}
					attributes={data.attributes}
					message={`Unsupported figure type ${type}`}
					payload={data.value}
					type="error"
				/>
			);
	}
}
