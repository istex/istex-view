import { useTranslation } from "react-i18next";
import { ControlledAccordion } from "../components/ControlledAccordion";
import { AuthorList } from "./AuthorList";
import { useAuthors } from "./useAuthors";

export function DocumentAuthors() {
	const { t } = useTranslation();

	const authors = useAuthors();

	if (authors.length === 0) {
		return null;
	}

	return (
		<ControlledAccordion id="authors" summary={t("authors.title")}>
			<AuthorList authors={authors} />
		</ControlledAccordion>
	);
}
