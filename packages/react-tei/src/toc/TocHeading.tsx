import { ListItemText } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTranslation } from "react-i18next";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import { Value } from "../tags/Value";
import type { Heading } from "./useTableOfContent";

export function TocHeading({ headings, isChild = false }: TocHeadingProps) {
	const { t } = useTranslation();
	const { navigateToHeading } = useDocumentNavigation();
	return (
		<List
			disablePadding
			sx={{
				paddingInlineStart: isChild ? 2 : 0,
			}}
			role={isChild ? "group" : "tree"}
			aria-label={!isChild ? t("document.tableOfContent") : undefined}
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
						role="treeitem"
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
