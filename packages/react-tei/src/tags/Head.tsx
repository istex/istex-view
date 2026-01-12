import Typography, { type TypographyProps } from "@mui/material/Typography";
import { DebugTag } from "../debug/DebugTag";
import type { ComponentProps } from "./type";
import { Value } from "./Value";

export function Head({
	data: { tag: tagName, value, attributes = {} },
}: ComponentProps) {
	if (!value || (Array.isArray(value) && value.length === 0)) {
		return null;
	}

	if (!attributes.level) {
		return (
			<DebugTag
				tag={tagName}
				attributes={attributes}
				message="Head tag without level attribute"
				payload={{ attributes, value }}
			>
				<Value data={value} />
			</DebugTag>
		);
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
