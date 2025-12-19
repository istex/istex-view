import List from "@mui/material/List";
import type { ComponentProps } from "../../tags/type.js";
import { Value } from "../../tags/Value.js";

export const Keywords = ({ data }: ComponentProps) => {
	if (!data.value || data.value.length === 0 || !Array.isArray(data.value)) {
		return null;
	}
	return (
		<List>
			<Value data={data.value.filter(({ tag }) => tag !== "#text")} />
		</List>
	);
};
