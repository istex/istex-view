import { InlineDebug } from "../debug/InlineDebug";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const DateTag = ({ data }: ComponentProps) => {
	if (!data.value || data.value.length === 0) {
		if (!data.attributes?.["@when"]) {
			return (
				<InlineDebug
					message="Date tag with no value nor @when attribute"
					payload={data}
				/>
			);
		}
		return data.attributes["@when"];
	}

	return <Value data={data.value} />;
};
