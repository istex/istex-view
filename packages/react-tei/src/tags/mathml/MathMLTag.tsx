import { createElement } from "react";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
import { useMathMLContext } from "./useMathMLContext";

export function MathMLTag({ data }: ComponentProps) {
	const nsPrefix = useMathMLContext();
	if (!nsPrefix) {
		return (
			<DebugTag
				tag={data.tag}
				attributes={data.attributes}
				message={`MathML tag <${data.tag}> found outside of MathML context`}
				payload={data}
			/>
		);
	}

	const tag = `${data.tag.replace(`${nsPrefix}:`, "")}`;

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
