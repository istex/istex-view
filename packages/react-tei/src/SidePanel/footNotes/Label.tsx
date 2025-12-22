import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const Label = ({ data }: ComponentProps) => {
	return <Value data={data.value} />;
};
