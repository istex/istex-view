import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { DocumentJson } from "../parser/document.js";
import { transformAbstract } from "../parser/transformDocument.js";
import { Value } from "../tags/Value.js";
import { AbstractAccordion } from "./AbstractAccordion.js";

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
