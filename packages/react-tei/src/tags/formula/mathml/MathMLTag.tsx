import { createElement } from "react";
import type { ComponentProps } from "../../type";
import { Value } from "../../Value";
import { useMathMLContext } from "./useMathMLContext";

export function MathMLTag({ data }: ComponentProps) {
	const nsPrefix = useMathMLContext();

	const tag = nsPrefix ? `${data.tag.replace(`${nsPrefix}:`, "")}` : data.tag;

	const attributes = data.attributes
		? Object.fromEntries(
				Object.entries(data.attributes).map(([key, value]) => [
					key.startsWith("@") ? key.slice(1) : key,
					value,
				]),
			)
		: {};

	return createElement(
		tag,
		attributes,
		data.value ? <Value data={data.value} /> : null,
	);
}
