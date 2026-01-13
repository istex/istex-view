import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { DocumentJson } from "../parser/document";
import { transformAbstract } from "../parser/transformDocument";
import { Value } from "../tags/Value";
import { AbstractAccordion } from "./AbstractAccordion";

export function SingleAbstract({ abstract }: SingleAbstractProps) {
	const { t } = useTranslation();

	const transformedAbstract = useMemo(
		() => transformAbstract(abstract),
		[abstract],
	);

	const content = useMemo(
		() =>
			Array.isArray(transformedAbstract.value)
				? transformedAbstract.value.filter((item) => {
						return item.tag !== "head";
					})
				: [],
		[transformedAbstract],
	);

	return (
		<AbstractAccordion title={t("document.abstract.title")}>
			<Value data={content} />
		</AbstractAccordion>
	);
}

type SingleAbstractProps = {
	abstract: DocumentJson;
};
