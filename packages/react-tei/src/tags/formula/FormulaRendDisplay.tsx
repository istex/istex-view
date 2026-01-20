import { useMemo } from "react";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FormulaRendDisplay({ data }: ComponentProps) {
	const mathMLFigure = useMemo(() => {
		if (!Array.isArray(data.value)) {
			return null;
		}

		return data.value.find(
			(item) =>
				item.tag === "figure" &&
				!item.attributes?.notation &&
				!item.attributes?.rend,
		);
	}, [data.value]);

	if (!mathMLFigure) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				payload={data}
				message="Expected a <figure> without notation or rend attribute inside formula rend display"
			>
				<Value data={data.value} />
			</DebugTag>
		);
	}

	return <Value data={mathMLFigure.value} />;
}
