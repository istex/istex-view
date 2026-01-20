import { DebugTag } from "../../debug/DebugTag";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { ComponentProps } from "../type";
import { Value } from "../Value";

export function FigureTable({ data }: ComponentProps) {
	const heads = findChildrenByName(data, "head");
	const tables = findChildrenByName(data, "table");

	if (tables.length !== 1 || !tables[0]) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message="Figure tag of type table without exactly one table child"
				payload={data.value}
			/>
		);
	}

	if (!Array.isArray(tables[0].value)) {
		return (
			<DebugTag
				tag={tables[0].tag}
				attributes={tables[0].attributes}
				message="Table tag has no value array"
				payload={tables[0]}
			/>
		);
	}

	return (
		<Value
			data={{
				...tables[0],
				attributes: {
					...tables[0].attributes,
					"@xml:id": data.attributes?.["@xml:id"],
				},
				value: [...heads, ...tables[0].value],
			}}
		/>
	);
}
