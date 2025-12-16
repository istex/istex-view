import type { i18n } from "i18next";
import { I18nextProvider } from "react-i18next";

import defaultI18n from "./i18n.js";

export function I18nProvider({
	i18n = defaultI18n,
	children,
}: I18nProviderProps) {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export type I18nProviderProps = {
	i18n?: i18n;
	children: React.ReactNode;
};
