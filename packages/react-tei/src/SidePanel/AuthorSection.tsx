import { List, ListItem, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { DocumentJson, DocumentJsonValue } from "../parser/document.js";
import { Accordion } from "./Accordion.js";
import { useAuthors } from "./useAuthors.js";

type AuthorProps = {
	data: DocumentJsonValue | undefined;
};

const Author = ({ data }: AuthorProps) => {
	const { t } = useTranslation();
	if (Array.isArray(data)) {
		return data.map((item, index) => <Author key={index} data={item} />);
	}

	if (typeof data === "string") {
		return <span>{data}</span>;
	}

	if (data && typeof data === "object") {
		const { tag, value } = data as DocumentJson;

		switch (tag) {
			case "#text":
				return String(value);
			case "affiliation":
				return null;
			case "persName":
				return Array.isArray(value) ? (
					<Typography>
						{value.map((item, index) => (
							<Author key={index} data={item} />
						))}
					</Typography>
				) : (
					<span>{String(value)}</span>
				);
			case "roleName":
			case "forename":
			case "surname":
			case "genName":
			case "orgName":
				return (
					<span aria-description={t(`sidebar.author.${tag}`)}>
						{Array.isArray(value) ? (
							value.map((item, index) => <Author key={index} data={item} />)
						) : (
							<span>{String(value)}</span>
						)}
					</span>
				);
			default:
				return Array.isArray(value) ? (
					value.map((item, index) => <Author key={index} data={item} />)
				) : (
					<span>{String(value)}</span>
				);
		}
	}

	return null;
};

export const AuthorSection = () => {
	const authors = useAuthors();

	console.log({ authors });
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
						<Author data={author.value} />
					</ListItem>
				))}
			</List>
		</Accordion>
	);
};
