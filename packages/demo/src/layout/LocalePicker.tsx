import reactTeiI18n from "@istex/react-tei/i18n/i18n.js";
import {
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	type SelectChangeEvent,
	Stack,
	Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n/i18n";
import globeIcon from "../images/globe.svg";

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

	const renderValue = () => (
		<Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
			<img src={globeIcon} alt="" />
			<Typography variant="body2" sx={{ fontSize: "0.75rem" }}>
				{currentLanguage.substring(0, 2).toUpperCase()}
			</Typography>
		</Stack>
	);

	return (
		<FormControl>
			<InputLabel id="locale-picker-label" sx={{ display: "none" }}>
				{t("navbar.LocalePicker.selectAriaLabel")}
			</InputLabel>
			<Select
				id="locale-picker"
				labelId="locale-picker-label"
				size="small"
				value={currentLanguage}
				onChange={onLocaleChange}
				renderValue={renderValue}
				sx={{
					...smallFontSize,
					bgcolor: "white",
					flexGrow: 1,
					"& .MuiSelect-select": {
						py: 0,
					},
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
		</FormControl>
	);
}
