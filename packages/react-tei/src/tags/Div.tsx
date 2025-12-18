import { Box } from "@mui/material";
import { useId, useMemo } from "react";
import type { ComponentProps } from "./type.js";
import { Value } from "./Value.js";

export function Div({ data: { value }, depth = 1 }: ComponentProps) {
	if (!Array.isArray(value)) {
		console.warn("Div tag with non-array value:", value);
		return null;
	}

	const hasHead = useMemo(
		() =>
			value.some((item) => {
				if (typeof item === "object" && item !== null && "tag" in item) {
					return item.tag === "head";
				}
				return false;
			}),
		[value],
	);

	const id = useId();

	const updatedValue = useMemo(() => {
		if (!hasHead) {
			return value;
		}

		return value.map((item) => {
			if (item?.tag !== "head") {
				return item;
			}

			return {
				...item,
				props: {
					id,
				},
			};
		});
	}, [hasHead, value, id]);

	if (hasHead) {
		return (
			<Box
				component="section"
				sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}
				aria-labelledby={id}
			>
				{updatedValue.map((value, index) => (
					<Value key={index} data={value} depth={hasHead ? depth + 1 : depth} />
				))}
			</Box>
		);
	}

	return (
		<Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}>
			{updatedValue.map((value, index) => (
				<Value key={index} data={value} depth={hasHead ? depth + 1 : depth} />
			))}
		</Box>
	);
}
