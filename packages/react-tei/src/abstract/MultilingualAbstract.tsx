import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DebugTag } from "../debug/DebugTag";
import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import { Value } from "../tags/Value";
import { AbstractAccordion } from "./AbstractAccordion";

const MAX_VISIBLE_TABS = 4;

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
					console.warn("Abstract without language attribute found, skipping.", {
						content: tab.content,
					});
					return false;
				}
				return true;
			},
		);

	const [selectedLang, setSelectedLang] = useState<string>(
		tabs?.at(0)?.lang ?? "",
	);
	const [startIndex, setStartIndex] = useState<number>(0);

	const visibleTabs = useMemo(
		() => tabs.slice(startIndex, startIndex + MAX_VISIBLE_TABS),
		[startIndex, tabs],
	);
	const canGoPrevious = startIndex > 0;
	const canGoNext = startIndex + MAX_VISIBLE_TABS < tabs.length;

	const handlePrevious = () => {
		if (canGoPrevious) {
			setStartIndex((prev) => prev - 1);
		}
	};

	const handleNext = () => {
		if (canGoNext) {
			setStartIndex((prev) => prev + 1);
		}
	};

	if (!tabs.length) {
		return (
			<DebugTag
				tag="abstract"
				message="No valid abstracts to display."
				payload={abstracts}
			/>
		);
	}

	return (
		<AbstractAccordion title={t("document.abstract.title")}>
			<ButtonGroup role="tablist" aria-label={t("document.lang")}>
				{tabs.length > 4 && (
					<Button
						onClick={handlePrevious}
						disabled={!canGoPrevious}
						variant="outlined"
						title={t("document.abstract.previousLanguage")}
						aria-label={t("document.abstract.previousLanguage")}
					>
						<ChevronLeft />
					</Button>
				)}
				{visibleTabs.map((tab) => {
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
							aria-selected={selectedLang === tab.lang}
							onClick={() => setSelectedLang(tab.lang)}
							variant={selectedLang === tab.lang ? "contained" : "outlined"}
						>
							{label}
						</Button>
					);
				})}
				{tabs.length > 4 && (
					<Button
						onClick={handleNext}
						disabled={!canGoNext}
						variant="outlined"
						title={t("document.abstract.nextLanguage")}
						aria-label={t("document.abstract.nextLanguage")}
					>
						<ChevronRight />
					</Button>
				)}
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
