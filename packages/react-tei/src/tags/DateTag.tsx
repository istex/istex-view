import { DebugTag } from "../debug/DebugTag";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const DateTag = ({ data }: ComponentProps) => {
	if (!data.value || data.value.length === 0) {
		if (!data.attributes?.["@when"]) {
			return (
				<DebugTag
					tag={data.tag}
					attributes={data.attributes}
					message="Date tag with no value nor @when attribute"
					payload={data}
				/>
			);
		}
		return data.attributes["@when"];
	}

	return <Value data={data.value} />;
};
