import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function NoOp({ data: { value } }: ComponentProps) {
	return <Value data={value} />;
}
