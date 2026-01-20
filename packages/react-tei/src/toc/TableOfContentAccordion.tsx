import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useTranslation } from "react-i18next";
import { TableOfContentTagCatalogProvider } from "./TableOfContentTagCatalogProvider";
import { TocHeading } from "./TocHeading";
import type { Heading } from "./useTableOfContent";

export function TableOfContentAccordion({
	tableOfContent,
}: TableOfContentAccordionProps) {
	const { t } = useTranslation();

	if (!tableOfContent?.length) {
		return null;
	}

	return (
		<Accordion
			aria-labelledby="table-of-contents"
			component="section"
			sx={{
				paddingInline: 6,
				paddingBlock: 4,
				"&::before": {
					display: "none",
				},
			}}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				slotProps={{
					content: {
						component: "div",
						id: "table-of-contents",
					},
				}}
			>
				{t("document.tableOfContent")}
			</AccordionSummary>
			<AccordionDetails
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: 2,
				}}
			>
				<TableOfContentTagCatalogProvider>
					<TocHeading headings={tableOfContent} isMobile />
				</TableOfContentTagCatalogProvider>
			</AccordionDetails>
		</Accordion>
	);
}

type TableOfContentAccordionProps = {
	tableOfContent: Heading[];
};
