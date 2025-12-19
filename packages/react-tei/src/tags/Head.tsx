import Typography, { type TypographyProps } from "@mui/material/Typography";

import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function Head({
	data: { value, props = {} },
	depth = 1,
}: ComponentProps) {
	if (!value || (Array.isArray(value) && value.length === 0)) {
		return null;
	}

	const headerLevel = Math.max(2, Math.min(6, depth));
	const tag = `h${headerLevel}` as TypographyProps["variant"];

	return (
		<Typography variant={tag} {...props}>
			<Value data={value} />
		</Typography>
	);
}
