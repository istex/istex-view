import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Ref({ data: { value } }: ComponentProps) {
	return <Value data={value} />;
}
