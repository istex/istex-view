import { Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import type { ComponentProps } from "../../../tags/type";
import { useImprintContent } from "./useImprintContent";

export function SourceImprint(props: ComponentProps) {
	const { t } = useTranslation();
	const imprintContent = useImprintContent(props);
	if (!imprintContent) {
		return null;
	}

	const content = [
		imprintContent?.volume &&
			t("source.volume", {
				volume: imprintContent.volume,
			}),
		imprintContent?.issue
			? imprintContent.year
				? t("source.issue_with_year", {
						issue: imprintContent.issue,
						year: imprintContent.year,
					})
				: t("source.issue_without_year", {
						issue: imprintContent.issue,
					})
			: imprintContent?.year && t("source.year", { year: imprintContent.year }),
		imprintContent?.pages.length &&
			t(`source.pages`, {
				pages: imprintContent.pages.join("-"),
				count: imprintContent.pages.length,
			}),
	]
		.filter(Boolean)
		.join(", ");

	const contentWithPublisher = [
		content,
		imprintContent?.publisher &&
			t("source.publisher", { publisher: imprintContent.publisher }),
	]
		.filter(Boolean)
		.join(" – ");

	return <Typography sx={{ paddingTop: 1 }}>{contentWithPublisher}</Typography>;
}
