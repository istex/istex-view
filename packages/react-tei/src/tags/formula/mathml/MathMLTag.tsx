import { createElement } from "react";
import type { ComponentProps } from "../../type";
import { Value } from "../../Value";

export function MathMLTag({ data }: ComponentProps) {
	const attributes = data.attributes
		? Object.fromEntries(
				Object.entries(data.attributes).map(([key, value]) => [
					key.startsWith("@") ? key.slice(1) : key,
					value,
				]),
			)
		: {};

	return createElement(
		data.tag,
		attributes,
		data.value ? <Value data={data.value} /> : null,
	);
}
