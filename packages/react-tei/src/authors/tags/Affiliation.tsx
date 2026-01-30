import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useId } from "react";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";
import { useValueSeparator } from "./useValueSeparator";

export function Affiliation({ data }: ComponentProps) {
	const id = useId();
	const value = useValueSeparator(data.value, ", ");

	if (!value.length) {
		return (
			<DebugTag
				tag={data.tag}
				message="Affiliation tag with no value array"
				payload={data}
				inline
			/>
		);
	}

	return (
		<ListItem
			sx={{
				padding: 0,
			}}
			aria-labelledby={id}
		>
			<ListItemText
				sx={{
					margin: 0,
				}}
				id={id}
			>
				<Value data={value} />
			</ListItemText>
		</ListItem>
	);
}
