import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useDocumentNavigation } from "../navigation/useNavigateToSection";
import { Value } from "../tags/Value";
import type { Heading } from "./useTableOfContent";

const ITEM_TEXT_HEIGHT = 24;

export function TocHeading({
	headings,
	isChild = false,
	isMobile = false,
}: TocHeadingProps) {
	const { t } = useTranslation();
	const { navigateToHeading, currentHeadingId } = useDocumentNavigation();
	return (
		<List
			disablePadding
			sx={{
				width: "100%",
				display: "flex",
				flexDirection: "column",
				position: "initial",
				...(isChild
					? {
							paddingInlineStart: 2,
						}
					: {
							gap: 0.5,
						}),
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
						position: "initial",
						width: "100%",
					}}
				>
					<ListItemText
						sx={{
							width: "100%",
							marginTop: 0,
							marginBottom: 0,
							cursor: "pointer",
							height: ITEM_TEXT_HEIGHT,
							contain: "strict",
							"& .MuiTypography-root": {
								fontSize: "0.875rem",
							},
						}}
						data-navigate-to={heading.id}
						onClick={() => {
							navigateToHeading(heading.id);
						}}
						role="treeitem"
						aria-current={heading.id === currentHeadingId ? "true" : undefined}
					>
						{!isMobile && (
							<Box
								aria-hidden="true"
								component="span"
								sx={{
									opacity: heading.id === currentHeadingId ? 1 : 0,
									position: "absolute",
									left: 0,
									width: "4px",
									height: ITEM_TEXT_HEIGHT,
									backgroundColor: (theme) => theme.palette.divider,
									transition: "opacity 0.3s ease-in-out",
								}}
							/>
						)}
						<Tooltip title={<Value data={heading.content} />} placement="right">
							<Typography
								component="span"
								sx={{
									display: "block",
									overflow: "hidden",
									textOverflow: "ellipsis",
									whiteSpace: "nowrap",
								}}
							>
								<Value data={heading.content} />
							</Typography>
						</Tooltip>
					</ListItemText>
					{heading.children.length > 0 && (
						<TocHeading
							headings={heading.children}
							isChild
							isMobile={isMobile}
						/>
					)}
				</ListItem>
			))}
		</List>
	);
}

export type TocHeadingProps = {
	headings: Heading[];
	isChild?: boolean;
	isMobile?: boolean;
};
