import { Box } from "@mui/material";
import { TocHeading } from "./TocHeading";
import type { Heading } from "./useTableOfContent";

export function TableOfContent({ tableOfContent }: TableOfContentProps) {
	return (
		<Box
			component="aside"
			sx={{
				flexGrow: 1,
				display: "flex",
				justifyContent: "flex-end",
				height: "100%",
				maxHeight: "100%",
				overflowX: "hidden",
				overflowY: "auto",
				padding: 4,
			}}
		>
			<Box
				sx={{
					maxWidth: "256px",
					width: "100%",
					height: "fit-content",
					borderInlineStart: (theme) => `1px solid ${theme.palette.divider}`,
					paddingInlineStart: 2,
					position: "relative",
					"& .MuiTypography-root": {
						fontSize: "0.875rem",
					},
				}}
			>
				<TocHeading headings={tableOfContent} />
			</Box>
		</Box>
	);
}

type TableOfContentProps = {
	tableOfContent: Heading[];
};
