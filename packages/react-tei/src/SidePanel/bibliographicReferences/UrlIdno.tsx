import { Link } from "@mui/material";
import { useMemo } from "react";
import { findTagByName } from "../../helper/findTagByName";
import type { ComponentProps } from "../../tags/type";
import { Value } from "../../tags/Value";

export const UrlIdno = ({ data }: ComponentProps) => {
	const text = useMemo(() => {
		const textTag = findTagByName(data, "#text");
		return textTag ? (textTag.value as string) : "";
	}, [data]);

	if (data.attributes?.["@type"] === "ORCID") {
		return null;
	}

	if (text.startsWith("https://") || text.startsWith("http://")) {
		return (
			<Link href={text} target="_blank" rel="noopener noreferrer">
				{text}
			</Link>
		);
	}

	return <Value data={data.value} />;
};
