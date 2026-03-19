import { expect, test } from "@playwright/test";
import { mockIstexApi } from "./support/mockIstexApi";

test("submitting the ARK form starts the viewer", async ({ page }) => {
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, {
		ark,
		documentFileName: "document.tei",
	});
	await page.goto("/");

	const arkInput = page.getByRole("textbox", { name: "ARK" });
	const submitButton = page.getByRole("button", { name: "Rechercher" });

	await arkInput.fill(ark);
	await submitButton.click();

	const title = page.getByRole("heading", {
		name: "Sample TEI File",
		level: 1,
	});
	await expect(title).toBeVisible();
});
