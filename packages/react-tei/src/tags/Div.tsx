import type { ComponentProps } from "./type.js";

import { Value } from "./Value.js";

export const Div = ({
	data: { value, attributes },
	depth = 1,
}: ComponentProps) => {
	if (!Array.isArray(value)) {
		console.warn("Div tag with non-array value:", value);
		return null;
	}

	return value.map((value, index) => (
		<Value
			key={index}
			data={value}
			depth={attributes?.["@type"] === "ElsevierSections" ? depth : depth + 1}
		/>
	));
};
