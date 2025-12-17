import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function P({ data }: ComponentProps) {
	return (
		<p>
			<Value data={data.value} />
		</p>
	);
}
