import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function Hi({ data }: ComponentProps) {
	return <Value data={data.value} />;
}
