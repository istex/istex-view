import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import { Value } from "../tags/Value";
import { AbstractAccordion } from "./AbstractAccordion";

export function MultilingualAbstract({ abstracts }: MultilingualAbstractProps) {
	const { t, i18n } = useTranslation();

	const tabs = abstracts
		.map((abstract) => {
			return {
				lang: abstract.attributes?.["@xml:lang"],
				content: abstract.value,
			};
		})
		.filter(
			(
				tab,
			): tab is { lang: string; content: DocumentJsonValue | undefined } => {
				if (!tab.lang) {
					console.warn("Abstract without language attribute found, skipping.");
					return false;
				}
				return true;
			},
		);

	const [selectedLang, setSelectedLang] = useState<string>(
		tabs?.at(0)?.lang ?? "",
	);

	if (!tabs.length) {
		console.warn("No valid abstracts to display.", abstracts);
		return null;
	}

	return (
		<AbstractAccordion title={t("document.abstract")}>
			<ButtonGroup role="tablist" aria-label={t("document.lang")}>
				{tabs.map((tab, index) => {
					const label = Intl.DisplayNames
						? new Intl.DisplayNames([i18n.language], {
								type: "language",
								fallback: "code",
							}).of(tab.lang)
						: tab.lang;
					return (
						<Button
							key={tab.lang}
							role="tab"
							tabIndex={index}
							aria-selected={selectedLang === tab.lang}
							onClick={() => setSelectedLang(tab.lang)}
							variant={selectedLang === tab.lang ? "contained" : "outlined"}
						>
							{label}
						</Button>
					);
				})}
			</ButtonGroup>

			{tabs.map((tab) => {
				if (tab.lang !== selectedLang) {
					return null;
				}
				return <Value data={tab.content} key={tab.lang} />;
			})}
		</AbstractAccordion>
	);
}

type MultilingualAbstractProps = {
	abstracts: DocumentJson[];
};
