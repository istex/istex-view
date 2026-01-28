import { useMemo } from "react";
import { findChildrenByName } from "../../helper/findChildrenByName";
import type { DocumentJson } from "../../parser/document";

export function useIsLabelledList(data: DocumentJson): boolean {
	return useMemo(() => {
		const items = findChildrenByName(data, "item");

		return items.some((item) => {
			return findChildrenByName(item, "label").length > 0;
		});
	}, [data]);
}
