import { ListItemText } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useDocumentNavigation } from "../navigation/useNavigateToSection.js";
import { Value } from "../tags/Value.js";
import type { Heading } from "./useTableOfContent.js";

export function TocHeading({ headings, isChild = false }: TocHeadingProps) {
	const { navigateToHeading } = useDocumentNavigation();
	return (
		<List
			disablePadding
			sx={{
				paddingInlineStart: isChild ? 2 : 0,
			}}
		>
			{headings.map((heading) => (
				<ListItem
					key={heading.id}
					disablePadding
					sx={{
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "flex-start",
						gap: 0.5,
					}}
				>
					<ListItemText
						sx={{
							marginTop: 0,
							marginBottom: 0,
							cursor: "pointer",
							"& .MuiTypography-root": {
								fontSize: "0.875rem",
							},
						}}
						data-navigate-to={heading.id}
						onClick={() => {
							navigateToHeading(heading.id);
						}}
					>
						<Value data={heading.content} />
					</ListItemText>
					{heading.children.length > 0 && (
						<TocHeading headings={heading.children} isChild />
					)}
				</ListItem>
			))}
		</List>
	);
}

export type TocHeadingProps = {
	headings: Heading[];
	isChild?: boolean;
};
