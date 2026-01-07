import path from "node:path";

import type { Page } from "@playwright/test";

export async function uploadFile(page: Page, name: string) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page
		.getByRole("button", { name: "Sélectionner un fichier TEI à visualiser" })
		.click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, `../../testdata/${name}`),
	);
}

export async function uploadUnitexEnrichmentFile(page: Page, name: string) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page
		.getByRole("button", {
			name: "Sélectionner un fichier d'enrichissement Unitex à appliquer (optionnel)",
		})
		.click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, `../../testdata/${name}`),
	);
}

export async function launchViewer(page: Page) {
	await page.getByRole("button", { name: "Lancer la visionneuse" }).click();
}
