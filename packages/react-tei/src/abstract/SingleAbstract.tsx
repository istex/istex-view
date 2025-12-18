import { useTranslation } from "react-i18next";

import type { DocumentJson } from "../parser/document.js";
import { Value } from "../tags/Value.js";
import { AbstractAccordion } from "./AbstractAccordion.js";

export function SingleAbstract({ abstract }: SingleAbstractProps) {
	const { t } = useTranslation();
	const head = Array.isArray(abstract.value)
		? abstract.value.find((item) => item.tag === "head")
		: undefined;

	const content = Array.isArray(abstract.value)
		? abstract.value.filter((item) => {
				return item.tag !== "head";
			})
		: [];

	return (
		<AbstractAccordion
			title={head ? <Value data={head?.value} /> : t("document.abstract")}
		>
			<Value data={content} depth={3} />
		</AbstractAccordion>
	);
}

type SingleAbstractProps = {
	abstract: DocumentJson;
};
