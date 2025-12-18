import { List, ListItem } from "@mui/material";
import { Value } from "../tags/Value.js";
import { Accordion } from "./Accordion.js";
import { useAuthors } from "./useAuthors.js";

export const AuthorSection = () => {
	const authors = useAuthors();

	if (authors.length === 0) {
		return null;
	}
	return (
		<Accordion name="authors" label="sidebar.authors">
			<List dense>
				{authors.map((author, index) => (
					<ListItem
						key={index}
						aria-label={author.attributes?.["@role"] || "author"}
					>
						<Value data={author.value} />
					</ListItem>
				))}
			</List>
		</Accordion>
	);
};
