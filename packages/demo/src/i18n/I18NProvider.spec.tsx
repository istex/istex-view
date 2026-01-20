import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { I18nProvider } from "./I18nProvider";

function TestFunction() {
	const { t } = useTranslation();

	return t("header.title");
}

describe("I18NProvider", () => {
	it("should translate header.title", async () => {
		const screen = await render(
			<I18nProvider>
				<TestFunction />
			</I18nProvider>,
		);

		await expect.element(screen.getByText("Viewer")).toBeDefined();
	});
});
