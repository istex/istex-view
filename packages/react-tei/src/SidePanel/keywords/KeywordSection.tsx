import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { keywordTagCatalog } from "./keywordTagCatalog";
import { useKeywordList } from "./useKeywordList";

export const KeywordSection = () => {
	const { t } = useTranslation();
	const { keywordList, count } = useKeywordList();

	if (count === 0) {
		return null;
	}

	return (
		<Accordion name="keywords" label={t("sidePanel.keyword.title", { count })}>
			<TagCatalogProvider tagCatalog={keywordTagCatalog}>
				<Value data={keywordList} />
			</TagCatalogProvider>
		</Accordion>
	);
};
