import { useMemo } from "react";
import type { DocumentJson, DocumentJsonValue } from "../../parser/document";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";
import { BiblLink } from "./BiblLink";

export const flattenValue = (
	remaining: DocumentJson[],
	acc: DocumentJson[] = [],
): DocumentJson[] => {
	if (remaining.length === 0) {
		return acc;
	}

	const [first, ...rest] = remaining;

	if (!first) {
		return flattenValue(rest, acc);
	}

	if (
		["monogr", "analytic", "imprint"].includes(first.tag) &&
		Array.isArray(first.value)
	) {
		const children = first.value.filter(
			(item): item is DocumentJson =>
				typeof item === "object" && item !== null && "tag" in item,
		);
		return flattenValue([...children, ...rest], acc);
	} else {
		return flattenValue(rest, [...acc, first]);
	}
};

export const getValueOrder = (value: DocumentJson): number => {
	switch (value.tag) {
		case "author":
			return 1;
		case "date":
			return 2;
		case "title":
			return value?.attributes?.["@type"] === "a" ? 3 : 6;
		case "publisher":
			return 4;
		case "pubPlace":
			return 5;
		case "biblScope":
			return 7;
		default:
			return 99;
	}
};

export const BiblStruct = ({ data }: ComponentProps) => {
	const { value } = data;

	const arrangedValue = useMemo((): DocumentJsonValue => {
		if (!Array.isArray(value)) {
			return [];
		}

		return flattenValue(value)
			.filter((item) => item.tag !== "#text")
			.sort((a, b) => {
				return getValueOrder(a) - getValueOrder(b);
			})
			.flatMap((value, index, array) => {
				return index < array.length - 1
					? [value, { tag: "#text", value: ", " }]
					: [value];
			});
	}, [value]);

	if (!Array.isArray(value)) {
		console.warn("BiblStruct value is not an array:", value);
		return null;
	}

	return (
		<BiblLink data={data}>
			<Value data={arrangedValue} />
		</BiblLink>
	);
};
