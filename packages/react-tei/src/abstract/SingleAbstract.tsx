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

	const head = useMemo(
		() =>
			Array.isArray(transformedAbstract.value)
				? transformedAbstract.value.find((item) => item.tag === "head")
				: undefined,
		[transformedAbstract],
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
		<AbstractAccordion
			title={head ? <Value data={head?.value} /> : t("document.abstract")}
		>
			<Value data={content} />
		</AbstractAccordion>
	);
}

type SingleAbstractProps = {
	abstract: DocumentJson;
};
