import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { DebugTag } from "../../debug/DebugTag";
import type { ComponentProps } from "../type";
import { Value } from "../Value";
import { useItem } from "./useListItem";

export function LabelledItem({ data }: ComponentProps) {
	const { htmlId, label, content, nestedList } = useItem({ data });

	return (
		<ListItem
			aria-labelledby={htmlId}
			sx={{
				display: "grid",
				gridTemplateColumns: "subgrid",
				columnGap: 2,
				gridColumn: "1 / span 2",
				alignItems: "flex-start",
				padding: 0,
				"& .MuiListItemText-root": { margin: 0 },
			}}
		>
			<ListItemText
				primary={
					label ? (
						<Value data={label.value} />
					) : (
						<DebugTag
							tag={data.tag}
							attributes={data.attributes}
							message="Labelled item without exactly one content paragraph, falling back to raw rendering"
							payload={data}
						>
							<Value data={data.value} />
						</DebugTag>
					)
				}
			/>
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
