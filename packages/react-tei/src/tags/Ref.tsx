import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function Ref({ data: { value } }: ComponentProps) {
	return <Value data={value} />;
}
