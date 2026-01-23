import MuiList, { type ListProps } from "@mui/material/List";
import { useContext, useMemo } from "react";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { ComponentProps } from "../type";
import { ListContext, type ListContextValue } from "./ListContext";
import { UnlabelledItem } from "./UnlabelledItem";

export function UnlabelledList({ data }: ComponentProps) {
	const parentListContext = useContext(ListContext);

	const items = useMemo(() => {
		return findChildrenByName(data, "item");
	}, [data]);

	const listType = useMemo<ListContextValue>(() => {
		if (parentListContext) {
			return parentListContext;
		}

		switch (data.attributes?.["@type"]) {
			case "order":
				return "ol";
			default:
				return "ul";
		}
	}, [parentListContext, data.attributes]);

	const listStyle = useMemo<ListProps["sx"]>(() => {
		return {
			listStyleType: listType === "ol" ? "decimal" : "disc",
		};
	}, [listType]);

	return (
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
	);
}
