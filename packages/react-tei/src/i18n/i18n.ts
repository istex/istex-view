import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import { en } from "./locales/en.js";
import { fr } from "./locales/fr.js";

i18n
	.use(
		resourcesToBackend({
			en: { translation: en },
			fr: { translation: fr },
		}),
	)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		interpolation: {
			escapeValue: false,
		},
	});

export default i18n;
