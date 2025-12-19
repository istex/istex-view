import { useMemo } from "react";
import type { DocumentJson, DocumentJsonValue } from "../parser/document.js";

export function extractHeadingsFromBody(
	currentValue: DocumentJsonValue,
	maxLevel: number,
): Heading[] {
	if (!Array.isArray(currentValue)) {
		return [];
	}

	return currentValue.flatMap((child): Heading[] => {
		// Ignore divs at max level as they should be ignored
		if (child.tag !== "div") {
			return extractHeadingsFromBody(child.value, maxLevel);
		}

		const level = child.attributes?.level
			? parseInt(child.attributes.level, 10)
			: -1;

		const id = child.attributes?.id ?? undefined;

		if (level > maxLevel || !Array.isArray(child.value)) {
			return [];
		}

		const head = child.value.find(
			(tag): tag is DocumentJson => tag.tag === "head",
		);

		if (!id || !level || !head) {
			return extractHeadingsFromBody(child.value, maxLevel);
		}

		return [
			{
				id,
				content: head.value,
				children: extractHeadingsFromBody(
					child.value.filter((tag): tag is DocumentJson => tag.tag !== "head"),
					maxLevel,
				),
			},
		];
	});
}

export function useTableOfContent(body: DocumentJson, maxLevel: number = 3) {
	return useMemo(() => {
		return extractHeadingsFromBody(body.value, maxLevel);
	}, [body, maxLevel]);
}

export type Heading = {
	id: string;
	content: DocumentJsonValue;
	children: Heading[];
};
