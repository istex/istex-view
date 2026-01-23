import { DebugTag } from "../debug/DebugTag";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function ListItem({ data }: ComponentProps) {
	return (
		<DebugTag
			tag={data.tag}
			attributes={data.attributes}
			message="Debugging list item"
			payload={data.value}
		>
			<Value data={data.value} />
		</DebugTag>
	);
}
