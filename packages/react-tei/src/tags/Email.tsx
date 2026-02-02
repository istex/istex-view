import { Link } from "@mui/material";
import { useMemo } from "react";
import { DebugTag } from "../debug/DebugTag";
import { findTagByName } from "../helper/findTagByName";
import type { ComponentProps } from "./type";

export const Email = ({ data }: ComponentProps) => {
	const email = useMemo(() => {
		const textTag = findTagByName(data, "#text");
		if (textTag && typeof textTag.value === "string") {
			return textTag.value.trim();
		}
	}, [data]);

	if (!email) {
		return (
			<DebugTag
				message="Could not extract email value"
				tag="email"
				attributes={data.attributes}
				payload={data}
			></DebugTag>
		);
	}

	return <Link href={`mailto:${email}`}>{email}</Link>;
};
