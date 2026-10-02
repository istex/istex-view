import { expect, test } from "@playwright/test";

test("change locale with the LocalePicker", async ({ page }) => {
	page.goto("/");

	const select = page.getByRole("combobox");
	const tagline = page.locator("header strong");

	expect(tagline).toHaveText(
		"Un nouveau regard sur les documents TEI dans Istex",
	);

	await select.click();
	const englishButton = page.getByRole("option", { name: "anglais" });
	await englishButton.click();

	expect(tagline).toHaveText("A new way to view TEI documents in Istex");

	await select.click();
	const spanishButton = page.getByRole("option", { name: "Spanish" });
	await spanishButton.click();

	expect(tagline).toHaveText(
		"Una nueva perspectiva sobre los documentos TEI en Istex",
	);
});
