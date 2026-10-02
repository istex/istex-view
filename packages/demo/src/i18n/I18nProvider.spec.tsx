import { useTranslation } from "react-i18next";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { I18nProvider } from "./I18nProvider";

function TestFunction() {
	const { t } = useTranslation();

	return t("header.subtitle");
}

describe("I18NProvider", () => {
	it("should translate header.subtitle", async () => {
		const screen = await render(
			<I18nProvider>
				<TestFunction />
			</I18nProvider>,
		);

		await expect
			.element(
				screen.getByText("Un nouveau regard sur les documents TEI dans Istex"),
			)
			.toBeDefined();
	});
});
