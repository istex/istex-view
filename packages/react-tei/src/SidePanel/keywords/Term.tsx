import ListItem from "@mui/material/ListItem";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const Term = ({ data }: ComponentProps) => {
	return (
		<ListItem>
			<Value data={data.value} />
		</ListItem>
	);
};
