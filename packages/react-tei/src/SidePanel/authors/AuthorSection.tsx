import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider.js";
import { Value } from "../../tags/Value.js";
import { Accordion } from "../Accordion.js";
import { authorTagCatalogs } from "./authorsTagCatalog.js";
import { useAuthors } from "./useAuthors.js";

export const AuthorSection = () => {
	const { t } = useTranslation();
	const authors = useAuthors();

	if (authors.length === 0) {
		return null;
	}

	return (
		<TagCatalogProvider tagCatalog={authorTagCatalogs}>
			<Accordion name="authors" label="sidePanel.author.title">
				<List dense>
					{authors.map((author, index) => (
						<ListItem key={index} aria-label={t("sidePanel.author.label")}>
							<Value data={author.value} />
						</ListItem>
					))}
				</List>
			</Accordion>
		</TagCatalogProvider>
	);
};
