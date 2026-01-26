import { useTranslation } from "react-i18next";
import { useDocumentContext } from "../../DocumentContextProvider";
import { Accordion } from "../Accordion";
import type { PanelSection } from "../DocumentSidePanelContext";
import { MulticatKeywords } from "./MulticatKeywords";

export function MulticatCategories() {
	const { t } = useTranslation();
	const { multicatEnrichment } = useDocumentContext();

	return (
		<>
			{multicatEnrichment?.map((category) => {
				return (
					<Accordion
						key={category.scheme}
						name={`multicat_${category.scheme}` as PanelSection}
						label={t(`multicat.${category.scheme}`)}
					>
						<MulticatKeywords keywords={category.keywords} />
					</Accordion>
				);
			})}
		</>
	);
}
