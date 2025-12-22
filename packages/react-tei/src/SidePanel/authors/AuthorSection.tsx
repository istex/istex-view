import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useTranslation } from "react-i18next";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { authorTagCatalogs } from "./authorsTagCatalog";
import { useAuthors } from "./useAuthors";

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
