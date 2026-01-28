import { Box } from "@mui/material";
import { useRef } from "react";
import { useResizePanelOnScroll } from "../helper/useResizePanelOnScroll";
import { TableOfContentTagCatalogProvider } from "./TableOfContentTagCatalogProvider";
import { TocHeading } from "./TocHeading";
import type { Heading } from "./useTableOfContent";

export function TableOfContent({
	tableOfContent,
	ref,
	stickyTopOffset,
}: TableOfContentProps) {
	const asideRef = useRef<HTMLDivElement | null>(null);

	useResizePanelOnScroll(asideRef);
	return (
		<TableOfContentTagCatalogProvider>
			<Box
				component="aside"
				sx={{
					flexGrow: 1,
					display: "flex",
					justifyContent: "flex-end",
					height: "100%",
					position: "sticky",
					top: stickyTopOffset ?? 0,
				}}
				ref={asideRef}
			>
				<Box
					sx={{
						height: "100%",
						maxHeight: "100%",
						overflowX: "hidden",
						overflowY: "auto",
						position: "relative",
						padding: 4,
						scrollbarWidth: "none",
						"&::-webkit-scrollbar": {
							display: "none",
						},
					}}
					ref={ref}
				>
					<Box
						sx={{
							maxWidth: "256px",
							width: "100%",
							height: "fit-content",
							borderInlineStart: (theme) =>
								`1px solid ${theme.palette.divider}`,
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

				<Box
					sx={{
						background:
							"linear-gradient(180deg,rgba(246, 249, 250, 0) 0%, rgba(246, 249, 250, 1) 100%)",
						position: "absolute",
						bottom: 0,
						left: 0,
						right: 0,
						height: "2rem",
						pointerEvents: "none",
					}}
				/>
			</Box>
		</TableOfContentTagCatalogProvider>
	);
}

type TableOfContentProps = {
	tableOfContent: Heading[];
	ref?: React.RefObject<HTMLDivElement | null>;
	stickyTopOffset?: number;
};
