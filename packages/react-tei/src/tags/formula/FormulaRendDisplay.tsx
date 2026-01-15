import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FormulaRendDisplay({ data }: ComponentProps) {
	if (!Array.isArray(data.value)) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				payload={data}
				message="Expected an array for formula rend display"
			>
				<Value data={data.value} />
			</DebugTag>
		);
	}

	const mathMLFigure = data.value.find(
		(item) =>
			item.tag === "figure" &&
			!item.attributes?.notation &&
			!item.attributes?.rend,
	);

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
