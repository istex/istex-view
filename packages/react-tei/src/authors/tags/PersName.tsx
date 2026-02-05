import { useMemo } from "react";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export function PersName({ data }: ComponentProps) {
	const value = useMemo(() => {
		if (!Array.isArray(data.value)) {
			return data.value;
		}

		return data.value.filter((item) => {
			if (item.tag === "forename") {
				return item.attributes?.["@type"] === "first";
			}
			return true;
		});
	}, [data.value]);

	return <Value data={value} />;
}
