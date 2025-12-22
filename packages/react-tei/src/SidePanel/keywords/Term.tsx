import ListItem from "@mui/material/ListItem";
import type { ComponentProps } from "../../tags/type.js";
import { Value } from "../../tags/Value.js";

export const Term = ({ data }: ComponentProps) => {
	return (
		<ListItem>
			<Value data={data.value} />
		</ListItem>
	);
};
