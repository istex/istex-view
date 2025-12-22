import { Link } from "@mui/material";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Ref({ data: { value, attributes } }: ComponentProps) {
	if (attributes?.["@type"] === "note") {
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
	return <Value data={value} />;
}
