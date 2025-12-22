import { useTranslation } from "react-i18next";
import { Value } from "../../tags/Value";
import { Accordion } from "../Accordion";
import { useDocumentSources } from "./useDocumentSources";

export const SourceSection = () => {
	const { t } = useTranslation();
	const documentSources = useDocumentSources();

	if (documentSources.length === 0) {
		return null;
	}

	return (
		<Accordion name="source" label={t("sidePanel.source.title")}>
			<Value data={documentSources} />
		</Accordion>
	);
};
