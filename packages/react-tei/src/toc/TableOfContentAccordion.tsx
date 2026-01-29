import { useTranslation } from "react-i18next";
import { ControlledAccordion } from "../components/ControlledAccordion";
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
		<ControlledAccordion
			id="table-of-contents"
			component="section"
			sx={{
				paddingInline: {
					xs: 0,
					md: 6,
				},
				paddingBlock: 4,
				"&::before": {
					display: "none",
				},
			}}
			summary={t("document.tableOfContent")}
		>
			<TableOfContentTagCatalogProvider>
				<TocHeading headings={tableOfContent} isMobile />
			</TableOfContentTagCatalogProvider>
		</ControlledAccordion>
	);
}

type TableOfContentAccordionProps = {
	tableOfContent: Heading[];
};
