import { useMemo } from "react";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const PersName = ({ data }: ComponentProps) => {
	const { value } = data;
	const reorderedValue = useMemo(() => {
		if (!Array.isArray(value)) {
			return [];
		}

		return value.flatMap((value, index, array) => {
			return index < array.length - 1
				? [value, { tag: "#text", value: " " }]
				: [value];
		});
	}, [value]);

	return <Value data={reorderedValue} />;
};
