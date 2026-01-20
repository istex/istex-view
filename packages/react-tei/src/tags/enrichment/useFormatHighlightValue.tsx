import { useMemo } from "react";
import { useDocumentContext } from "../../DocumentContextProvider";
import type { DocumentJsonValue } from "../../parser/document";
import { areGroupsEqual } from "./areGroupsEqual";
import { getGroups } from "./getGroups";
import { getHiddenGroups } from "./getHiddenGroups";

export type HighlightValue = {
	tag: string;
	attributes?: {
		term?: string;
		groups?: string[] | string;
		parentHiddenGroups?: string[];
	};
	value: string | HighlightValue[];
};

export type useFormatHighlightValueParams = {
	data: HighlightValue;
};

export function useFormatHighlightValue({
	data: { attributes, value },
}: useFormatHighlightValueParams) {
	const { termEnrichment } = useDocumentContext();

	const groups = useMemo(() => {
		return getGroups(attributes?.groups);
	}, [attributes?.groups]);

	const hiddenGroups = useMemo(() => {
		return getHiddenGroups({
			enrichmentGroups: termEnrichment?.document,
			term: attributes?.term,
			groups,
			parentHiddenGroups: attributes?.parentHiddenGroups,
		});
	}, [
		termEnrichment,
		attributes?.term,
		groups,
		attributes?.parentHiddenGroups,
	]);

	const formattedValue = useMemo(() => {
		if (!Array.isArray(value)) {
			return value;
		}

		return value.flatMap((item) => {
			if (typeof item === "string" || item.tag !== "highlight") {
				return item;
			}

			const childrenGroups = getGroups(item.attributes?.groups);

			if (
				item.attributes?.term === attributes?.term &&
				areGroupsEqual(childrenGroups, groups)
			) {
				if (typeof item.value === "string") {
					return {
						tag: "#text",
						value: item.value,
					};
				}

				return item.value;
			}

			return [
				{
					...item,
					attributes: {
						...item.attributes,
						parentHiddenGroups: hiddenGroups,
					},
				},
			];
			// We lie about the return type to satisfy TS, as we know for sure that the output will conform to DocumentJsonValue
		}) as unknown as DocumentJsonValue;
	}, [groups, value, hiddenGroups, attributes?.term]);

	return useMemo(() => {
		const displayedGroups = groups.filter((group) => {
			return !hiddenGroups.includes(group);
		});

		return {
			groups,
			displayedGroups,
			value: formattedValue,
		};
	}, [groups, hiddenGroups, formattedValue]);
}
