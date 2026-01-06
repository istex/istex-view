import { useMemo } from "react";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

const getTagOrder = (tag: string): number => {
	switch (tag) {
		case "surname":
			return 1;
		case "forename":
			return 2;
		default:
			return 99;
	}
};

export const PersName = ({ data }: ComponentProps) => {
	const { value } = data;
	const reorderedValue = useMemo(() => {
		if (!Array.isArray(value)) {
			return [];
		}

		return value
			.sort((a, b) => {
				return getTagOrder(a.tag) - getTagOrder(b.tag);
			})
			.flatMap((value, index, array) => {
				return index < array.length - 1
					? [value, { tag: "#text", value: " " }]
					: [value];
			});
	}, [value]);

	return <Value data={reorderedValue} />;
};
