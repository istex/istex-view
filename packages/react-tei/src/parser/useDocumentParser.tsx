import { XMLParser } from "fast-xml-parser";
import { useMemo } from "react";
import type { DocumentJson } from "./document";

const parser = new XMLParser({
	ignoreAttributes: false,
	attributeNamePrefix: "@",
	preserveOrder: true,
	trimValues: false,
	parseTagValue: false,
});

function transform(obj: unknown): DocumentJson | DocumentJson[] | string {
	if (Array.isArray(obj)) {
		return obj.map(transform) as DocumentJson[];
	}

	if (obj && typeof obj === "object") {
		return Object.fromEntries(
			Object.entries(obj).flatMap(
				([key, value]: [string, unknown]): [string, unknown][] => {
					if (key === ":@") {
						return [["attributes", value]];
					}

					return [
						["tag", key],
						["value", transform(value)],
					];
				},
			),
		) as DocumentJson;
	}

	return obj as string;
}

export function useDocumentParser(document: string | null | undefined) {
	return useMemo(() => {
		if (!document) {
			return null;
		}
		const jsonDocument = parser.parse(document);
		const transformedDocument = transform(jsonDocument);

		if (Array.isArray(transformedDocument)) {
			return transformedDocument as DocumentJson[];
		}

		return [transformedDocument as DocumentJson];
	}, [document]);
}
