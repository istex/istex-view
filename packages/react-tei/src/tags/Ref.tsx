import { Link } from "@mui/material";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Ref({ data: { value, attributes } }: ComponentProps) {
	return (
		<Link
			component="button"
			onClick={() => {
				// TODO: implement scrolling to target
				// console.log(attributes?.["@target"]);
			}}
		>
			<Value data={value} />
		</Link>
	);
}
