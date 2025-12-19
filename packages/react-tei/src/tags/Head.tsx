import Typography, { type TypographyProps } from "@mui/material/Typography";

import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function Head({ data: { value, attributes = {} } }: ComponentProps) {
	if (!value || (Array.isArray(value) && value.length === 0)) {
		return null;
	}

	if (!attributes.level) {
		console.warn("Head tag without level attribute:", { attributes, value });
		return <Value data={value} />;
	}

	const id = attributes.id;
	const depth = parseInt(attributes.level, 10);

	const headerLevel = Math.max(2, Math.min(6, depth));
	const tag = `h${headerLevel}` as TypographyProps["variant"];

	return (
		<Typography variant={tag} id={id}>
			<Value data={value} />
		</Typography>
	);
}
