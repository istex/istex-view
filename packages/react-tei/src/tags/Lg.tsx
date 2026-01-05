import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Lg = ({ data }: ComponentProps) => {
	return (
		<div>
			<Value data={data.value} />
		</div>
	);
};
