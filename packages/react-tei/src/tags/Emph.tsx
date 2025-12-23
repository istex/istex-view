import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Emph = ({ data }: ComponentProps) => {
	return (
		<em>
			<Value data={data.value} />
		</em>
	);
};
