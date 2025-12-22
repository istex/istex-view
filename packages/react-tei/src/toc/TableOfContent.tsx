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
				paddingBlock: 2,
				paddingInline: 4,
			}}
		>
			<Box
				sx={{
					maxWidth: "256px",
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
