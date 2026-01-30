import List from "@mui/material/List";
import type { DocumentJson } from "../parser/document";
import { TagCatalogProvider } from "../tags/TagCatalogProvider";
import { Value } from "../tags/Value";
import { authorTagCatalogs } from "./authorsTagCatalog";

export function AuthorList({ authors }: AuthorListProps) {
	if (authors.length === 0) {
		return null;
	}

	return (
		<TagCatalogProvider tagCatalog={authorTagCatalogs}>
			<List
				sx={{
					paddingBlock: 0,
					"& > li + li": {
						paddingTop: 2,
					},
				}}
			>
				<Value data={authors} />
			</List>
		</TagCatalogProvider>
	);
}

type AuthorListProps = {
	authors: DocumentJson[];
};
