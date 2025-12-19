import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useTranslation } from "react-i18next";
import { TocHeading } from "./TocHeading.js";
import type { Heading } from "./useTableOfContent.js";

export function TableOfContentAccordion({
	tableOfContent,
}: TableOfContentAccordionProps) {
	const { t } = useTranslation("document.toc");

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
				<TocHeading headings={tableOfContent} />
			</AccordionDetails>
		</Accordion>
	);
}

type TableOfContentAccordionProps = {
	tableOfContent: Heading[];
};
