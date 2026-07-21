import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

export function I18nProvider({ children }: I18nProviderProps) {
	return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

export type I18nProviderProps = {
	children: React.ReactNode;
};
