import Box from "@mui/material/Box";
import { InlineDebug } from "../debug/InlineDebug";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Div({ data: { value, attributes } }: ComponentProps) {
	if (!Array.isArray(value)) {
		return (
			<InlineDebug message="Div tag with non-array value" payload={value} />
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
