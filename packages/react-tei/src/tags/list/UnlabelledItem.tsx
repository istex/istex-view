import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
import { useListItem } from "./useListItem";

export function UnlabelledItem({ data }: ComponentProps) {
	const { htmlId, content, nestedList } = useListItem({ data });

	return (
		<ListItem
			aria-labelledby={htmlId}
			sx={{
				display: "list-item",
				padding: 0,
				"& .MuiListItemText-root": { margin: 0 },
			}}
		>
			<ListItemText id={htmlId}>
				{content ? (
					<Value data={content.value} />
				) : (
					<DebugTag
						tag={data.tag}
						attributes={data.attributes}
						message="Labelled item without exactly one content paragraph, falling back to raw rendering"
						payload={data}
					>
						<Value data={data.value} />
					</DebugTag>
				)}
			</ListItemText>
			<Value data={nestedList} />
		</ListItem>
	);
}
