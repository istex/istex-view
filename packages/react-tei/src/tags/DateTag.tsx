import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const DateTag = ({ data }: ComponentProps) => {
	if (!data.value || data.value.length === 0) {
		if (!data.attributes?.["@when"]) {
			console.warn(
				"Date tag with no value nor @when attribute encountered:",
				data,
			);
			return null;
		}
		return data.attributes["@when"];
	}

	return <Value data={data.value} />;
};
