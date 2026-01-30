import { Typography } from "@mui/material";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";
import { useValueSeparator } from "./useValueSeparator";

export function Address({ data }: ComponentProps) {
	const value = useValueSeparator(data.value, ", ");

	if (!value.length) {
		return (
			<DebugTag
				tag={data.tag}
				message="Address tag with no value array"
				payload={data}
				inline
			/>
		);
	}

	return (
		<Typography
			component="address"
			sx={{
				fontStyle: "normal",
				display: "inline",
			}}
		>
			<Value data={value} />
		</Typography>
	);
}
