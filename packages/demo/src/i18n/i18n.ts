import { createInstance, type i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { enGB } from "./locales/en-GB";
import { frFR } from "./locales/fr-FR";

const resources = {
	"fr-FR": { translation: frFR },
	"en-GB": { translation: enGB },
};

export const supportedLanguages = Object.keys(
	resources,
) as (keyof typeof resources)[];

const i18nInstance: i18n = createInstance()
	.use(initReactI18next)
	.use(LanguageDetector);

i18nInstance.init({
	fallbackLng: supportedLanguages[0],
	interpolation: {
		escapeValue: false,
	},
	resources,
});

export default i18nInstance;
