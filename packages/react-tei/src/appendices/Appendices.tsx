import { useTranslation } from "react-i18next";
import { ControlledAccordion } from "../components/ControlledAccordion";
import { Value } from "../tags/Value";
import { useDocumentAppendices } from "./useDocumentAppendices";

export function Appendices() {
	const { t } = useTranslation();

	const appendices = useDocumentAppendices();

	if (!appendices) {
		return null;
	}

	return (
		<ControlledAccordion id="appendices" summary={t("appendices.title")}>
			<Value data={appendices} />
		</ControlledAccordion>
	);
}
