import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const Note = ({ data }: ComponentProps) => {
	return <Value data={data.value} />;
};
