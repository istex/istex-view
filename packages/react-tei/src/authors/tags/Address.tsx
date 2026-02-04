import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";
import { useJoinValues } from "./useJoinValues";

export function Address({ data }: ComponentProps) {
	const value = useJoinValues(data.value, ", ");

	if (!value.length) {
		return (
			<DebugTag
				tag={data.tag}
				message="Address tag with no value array"
				payload={data}
				inline
			/>
		);
	}

	return <Value data={value} />;
}
