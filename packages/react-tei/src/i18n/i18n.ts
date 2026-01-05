import { createInstance, type i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { en } from "./locales/en";
import { fr } from "./locales/fr";

const i18nInstance: i18n = createInstance({
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
	resources: {
		en: { translation: en },
		fr: { translation: fr },
	},
}).use(LanguageDetector);

i18nInstance.init();

export default i18nInstance;
