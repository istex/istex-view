import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const DateTag = ({ data }: ComponentProps) => {
	if (!data.value) {
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
