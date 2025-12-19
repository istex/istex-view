import { TagCatalogProvider } from "../../tags/TagCatalogProvider.js";
import { Value } from "../../tags/Value.js";
import { Accordion } from "../Accordion.js";
import { keywordTagCatalog } from "./keywordTagCatalog.js";
import { useKeywordList } from "./useKeywordList.js";

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
