import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { keywordTagCatalog } from "./keywordTagCatalog";
import { useKeywordList } from "./useKeywordList";

export const KeywordSection = () => {
	const keywordList = useKeywordList();

	if (keywordList.length === 0) {
		return null;
	}

	return (
		<Accordion name="keywords" label="sidePanel.keyword.title">
			<TagCatalogProvider tagCatalog={keywordTagCatalog}>
				<Value data={keywordList} />
			</TagCatalogProvider>
		</Accordion>
	);
};
