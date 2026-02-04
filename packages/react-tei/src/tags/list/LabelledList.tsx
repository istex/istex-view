import List, { type ListProps } from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
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
	const heads = useMemo(() => {
		return findChildrenByName(data, "head");
	}, [data]);

	const items = useMemo(() => {
		return findChildrenByName(data, "item");
	}, [data]);

	return (
		<Stack spacing={1}>
			{heads.map((head) => {
				return (
					<Typography role="heading">
						<Value data={head.value} />
					</Typography>
				);
			})}
			<List sx={labelledListSx}>
				{items.map((item, index) => {
					return <LabelledItem key={index} data={item} />;
				})}
			</List>
		</Stack>
	);
}
