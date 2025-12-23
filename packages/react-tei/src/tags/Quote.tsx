import type { ComponentProps } from "./type";
import { Value } from "./Value";

export const Quote = ({ data }: ComponentProps) => {
	return (
		<blockquote>
			<Value data={data.value} />
		</blockquote>
	);
};
