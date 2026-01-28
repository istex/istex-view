import List, { type ListProps } from "@mui/material/List";
import { useMemo } from "react";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { ComponentProps } from "../type";
import { LabelledItem } from "./LabelledItem";

export const labelledListSx: ListProps["sx"] = {
	display: "grid",
	gridTemplateColumns: "auto 1fr",
	width: "100%",
	paddingBlock: 0,
	"& .MuiList-root": {
		gridColumn: "2",
	},
};

export function LabelledList({ data }: ComponentProps) {
	const items = useMemo(() => {
		return findChildrenByName(data, "item");
	}, [data]);

	return (
		<List sx={labelledListSx}>
			{items.map((item, index) => {
				return <LabelledItem key={index} data={item} />;
			})}
		</List>
	);
}
