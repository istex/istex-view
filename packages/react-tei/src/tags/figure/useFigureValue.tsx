import { useMemo } from "react";
import type { DocumentJson } from "../../parser/document";
import type { ComponentProps } from "../type";

const SKIPPED_TAGS = ["graphic", "link", "highlightedText"];

export function hasInnerText(document: DocumentJson): boolean {
	if (!document.value) {
		return false;
	}

	if (typeof document.value === "string") {
		return document.value.trim().length > 0;
	}

	return document.value.some((child) => hasInnerText(child));
}

export function useFigureValue({ data }: ComponentProps) {
	return useMemo(() => {
		if (!Array.isArray(data.value)) {
			return data.value;
		}
		return data.value.filter((child) => {
			if (SKIPPED_TAGS.includes(child.tag)) {
				return false;
			}

			if (child.tag === "figDesc") {
				return hasInnerText(child);
			}

			if (Array.isArray(child.value) && child.value.length === 0) {
				return false;
			}

			return true;
		});
	}, [data.value]);
}
