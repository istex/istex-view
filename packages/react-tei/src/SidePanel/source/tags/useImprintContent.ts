import { useMemo } from "react";
import { findChildrenByName } from "../../../helper/findChildrenByName";
import { findTagByName } from "../../../helper/findTagByName";
import type { ComponentProps } from "../../../tags/type";

export function useImprintContent({ data }: ComponentProps) {
	const biblScopes = useMemo(() => {
		return findChildrenByName(data, "biblScope");
	}, [data]);

	const publisher = useMemo(() => {
		const publisherTag = findChildrenByName(data, "publisher").at(0);
		return findTagByName(publisherTag, "#text")?.value as string;
	}, [data]);

	const volume = useMemo(() => {
		const volume = biblScopes.find((bs) => bs.attributes?.["@unit"] === "vol");
		return findTagByName(volume, "#text")?.value as string;
	}, [biblScopes]);

	const issue = useMemo(() => {
		const issue = biblScopes.find((bs) => bs.attributes?.["@unit"] === "issue");
		return findTagByName(issue, "#text")?.value as string;
	}, [biblScopes]);

	const year = useMemo(() => {
		const dateTag = findChildrenByName(data, "date").at(0);
		const date = (dateTag?.attributes?.["@when"] ??
			findTagByName(dateTag, "#text")?.value) as string;
		if (date) {
			return date.split("-")[0];
		}
		return undefined;
	}, [data]);

	const pages = useMemo(() => {
		const pageScopes = biblScopes.filter(
			(bs) => bs.attributes?.["@unit"] === "page",
		);
		const fromPage = pageScopes.find(
			(ps) =>
				ps.attributes?.["@from"] ||
				(!ps.attributes?.["@from"] && !ps.attributes?.["@to"]),
		);

		const toPage = pageScopes.find((ps) => ps.attributes?.["@to"]);

		const fromPageValue = findTagByName(fromPage, "#text")?.value as string;
		const toPageValue = findTagByName(toPage, "#text")?.value as string;

		if (!fromPageValue) {
			return [];
		}

		if (toPageValue && fromPageValue !== toPageValue) {
			return [fromPageValue, toPageValue];
		}

		return [fromPageValue];
	}, [biblScopes]);

	return useMemo(() => {
		if (!publisher && !volume && !issue && !year && pages.length === 0) {
			return null;
		}

		return { publisher, volume, issue, year, pages };
	}, [publisher, volume, issue, year, pages]);
}
