import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { I18nProvider } from "./I18nProvider";

function TestFunction() {
	const { t } = useTranslation();

	return t("document.abstract.title");
}

describe("I18NProvider", () => {
	it("should translate document.abstract.title", async () => {
		const screen = await render(
			<I18nProvider>
				<TestFunction />
			</I18nProvider>,
		);

		await expect.element(screen.getByText("Résumé")).toBeDefined();
	});
});
