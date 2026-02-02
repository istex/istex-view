import { useMemo } from "react";
import type { DocumentJsonValue } from "../../parser/document";

export function useJoinValues(value: DocumentJsonValue, separator: string) {
	return useMemo(() => {
		if (!Array.isArray(value)) {
			return [];
		}

		return value
			.filter((item) => {
				if (item.tag === "#text") {
					return !!(item.value as string)?.trim();
				}
				return true;
			})
			.flatMap((item, i) => {
				if (i === 0) {
					return [item];
				}
				return [{ tag: "#text", value: separator }, item];
			});
	}, [value, separator]);
}
