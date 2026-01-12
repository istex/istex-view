import Box from "@mui/material/Box";
import { DebugTag } from "../debug/DebugTag";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Div({ data: { tag, value, attributes } }: ComponentProps) {
	if (!Array.isArray(value)) {
		return (
			<DebugTag
				tag={tag}
				attributes={attributes}
				message="Div tag with non-array value"
				payload={value}
			/>
		);
	}

	if (attributes?.level) {
		return (
			<Box
				component="section"
				sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}
				aria-labelledby={attributes.id}
			>
				<Value data={value} />
			</Box>
		);
	}

	return (
		<Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
			<Value data={value} />
		</Box>
	);
}
