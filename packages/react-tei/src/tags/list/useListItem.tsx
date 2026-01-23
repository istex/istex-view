import { useId, useMemo } from "react";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { DocumentJson } from "../../parser/document";

const LABEL_TAG = "label";
const PARAGRAPH_TAG = "p";
const LIST_TAG = "list";

export function useItem({ data }: useItemProps) {
	const id = useId();
	const htmlId = useMemo(() => {
		const attributesId = data.attributes?.["@xml:id"];
		return `list-item-${attributesId ?? id}`;
	}, [id, data.attributes]);

	const label = useMemo(() => {
		const labels = findChildrenByName(data, LABEL_TAG);
		if (labels.length !== 1) {
			return undefined;
		}
		return labels[0];
	}, [data]);

	const paragraph = useMemo(() => {
		const paragraphs = findChildrenByName(data, PARAGRAPH_TAG);
		if (paragraphs.length === 1) {
			return paragraphs[0];
		}

		if (!Array.isArray(data.value)) {
			return undefined;
		}

		return {
			...data,
			value: data.value.filter((child) => child.tag !== LABEL_TAG),
		};
	}, [data]);

	const content = useMemo(() => {
		if (!Array.isArray(paragraph?.value)) {
			return undefined;
		}
		return {
			...paragraph,
			value: paragraph.value.filter((child) => child.tag !== LIST_TAG),
		};
	}, [paragraph]);

	const nestedList = useMemo(() => {
		return findChildrenByName(paragraph, LIST_TAG).at(0);
	}, [paragraph]);

	return useMemo(
		() => ({
			htmlId,
			label,
			content,
			nestedList,
		}),
		[htmlId, label, content, nestedList],
	);
}

export type useItemProps = {
	data: DocumentJson;
};
