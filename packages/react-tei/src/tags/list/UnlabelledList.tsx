import MuiList, { type ListProps } from "@mui/material/List";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
import { ListContext } from "./ListContext";
import { UnlabelledItem } from "./UnlabelledItem";
import { useListType } from "./useListType";

export function UnlabelledList({ data }: ComponentProps) {
	const heads = useMemo(() => {
		return findChildrenByName(data, "head");
	}, [data]);
	const items = useMemo(() => {
		return findChildrenByName(data, "item");
	}, [data]);

	const listType = useListType(data.attributes?.["@type"]);

	const listStyle = useMemo<ListProps["sx"]>(() => {
		return {
			listStyleType: listType === "ol" ? "decimal" : "disc",
		};
	}, [listType]);

	return (
		<Stack spacing={1}>
			{heads.map((head) => {
				return (
					<Typography role="heading">
						<Value data={head.value} />
					</Typography>
				);
			})}
			<ListContext.Provider value={listType}>
				<MuiList
					component={listType}
					sx={{
						paddingInlineStart: 2,
						paddingBlock: 0,
						display: "list",
						...listStyle,
					}}
				>
					{items.map((item, index) => {
						return <UnlabelledItem key={index} data={item} />;
					})}
				</MuiList>
			</ListContext.Provider>
		</Stack>
	);
}
