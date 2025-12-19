import path from "node:path";

import type { Page } from "@playwright/test";

export async function uploadFile(page: Page, name: string) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page.getByRole("button", { name: "Select a TEI File to View" }).click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, `../../testdata/${name}`),
	);
}
