import reactTeiI18n from "@istex/react-tei/i18n/i18n.js";
import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n/i18n";

const smallFontSize = {
	fontSize: "0.625rem",
};

export default function LocalePicker() {
	const { t, i18n } = useTranslation();
	const currentLanguage = i18n.resolvedLanguage as string;

	const languageLabels = new Intl.DisplayNames([currentLanguage], {
		type: "language",
	});

	const onLocaleChange = (event: SelectChangeEvent) => {
		i18n.changeLanguage(event.target.value);
		reactTeiI18n.changeLanguage(event.target.value);
	};

	return (
		<Select
			size="small"
			value={currentLanguage}
			onChange={onLocaleChange}
			inputProps={{ "aria-label": t("navbar.LocalePicker.selectAriaLabel") }}
			sx={{
				...smallFontSize,
				bgcolor: "white",
			}}
		>
			{supportedLanguages.map((supportedLanguage) => {
				// We only want to labelize the languages, not the full locale. Locales follow
				// the <lang-COUNTRY> format, so the language portion is the first 2 characters
				const language = supportedLanguage.substring(0, 2);

				return (
					<MenuItem
						key={supportedLanguage}
						value={supportedLanguage}
						sx={smallFontSize}
					>
						{languageLabels.of(language)}
					</MenuItem>
				);
			})}
		</Select>
	);
}
