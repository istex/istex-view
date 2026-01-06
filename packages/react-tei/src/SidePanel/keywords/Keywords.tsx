import List from "@mui/material/List";
import { useMemo } from "react";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const Keywords = ({ data }: ComponentProps) => {
	const value = useMemo(() => {
		if (!data.value || !Array.isArray(data.value) || data.value.length === 0) {
			return [];
		}

		return data.value.filter(({ tag }) => tag !== "#text");
	}, [data]);
	if (value.length === 0) {
		return null;
	}
	return (
		<List dense>
			<Value data={value} />
		</List>
	);
};
