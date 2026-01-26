import { Box } from "@mui/material";
import { TableOfContentTagCatalogProvider } from "./TableOfContentTagCatalogProvider";
import { TocHeading } from "./TocHeading";
import type { Heading } from "./useTableOfContent";

export function TableOfContent({ tableOfContent, ref }: TableOfContentProps) {
	return (
		<TableOfContentTagCatalogProvider>
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
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": {
						display: "none",
					},
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
					ref={ref}
				>
					<Box
						sx={{
							background:
								"linear-gradient(180deg,rgba(246, 249, 250, 0) 0%, rgba(246, 249, 250, 1) 100%)",
							position: "fixed",
							bottom: 0,
							left: 0,
							right: 0,
							height: "2rem",
							pointerEvents: "none",
						}}
					/>
					<TocHeading headings={tableOfContent} />
				</Box>
			</Box>
		</TableOfContentTagCatalogProvider>
	);
}

type TableOfContentProps = {
	tableOfContent: Heading[];
	ref?: React.RefObject<HTMLDivElement | null>;
};
