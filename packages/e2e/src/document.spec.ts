import path from "node:path";

import { expect, test } from "@playwright/test";

test("open a document", async ({ page }) => {
	await page.goto("/");

	const fileChooserPromise = page.waitForEvent("filechooser");
	await page.getByRole("button", { name: "Select a TEI File to View" }).click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, "../testdata/document.tei"),
	);

	expect(page.getByText("<TEI></TEI>")).toBeVisible();
});
