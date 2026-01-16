import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { Value } from "../../tags/Value";
import type { Keywords } from "./useParseMulticatCategories";

export function MulticatKeywords({ keywords, isChild }: MulticatKeywordsProps) {
	return (
		<List
			role={isChild ? "group" : "tree"}
			className="unstyled"
			sx={{
				paddingInlineStart: 2,
				paddingInlineEnd: isChild ? 0 : 2,
			}}
			dense
		>
			{keywords.map(({ level, keyword, children }, index) => (
				<ListItem key={index} disablePadding>
					<ListItemText
						role="treeitem"
						sx={{
							"& .MuiTypography-root": {
								display: "flex",
								alignItems: "flex-start",
								gap: 0.5,
							},
						}}
					>
						<Box component="span">{level}</Box>
						<Box component="span">-</Box>
						<Box component="span">
							<Value data={keyword} />
						</Box>
					</ListItemText>
					{children.length > 0 && (
						<MulticatKeywords keywords={children} isChild />
					)}
				</ListItem>
			))}
		</List>
	);
}

type MulticatKeywordsProps = {
	keywords: Keywords[];
	isChild?: boolean;
};
