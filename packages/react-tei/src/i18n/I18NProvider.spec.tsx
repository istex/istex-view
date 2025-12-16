import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { I18nProvider } from "./I18nProvider.js";

function TestFunction() {
	const { t } = useTranslation();

	return t("document.abstract");
}

describe("I18NProvider", () => {
	it("should translate document.abstract", async () => {
		const screen = await render(
			<I18nProvider>
				<TestFunction />
			</I18nProvider>,
		);

		expect(screen.getByText("Résumé")).toBeDefined();
	});
});
