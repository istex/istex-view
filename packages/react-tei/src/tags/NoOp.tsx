import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function NoOp({ data: { value } }: ComponentProps) {
	return <Value data={value} />;
}
