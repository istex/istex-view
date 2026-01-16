import path from "node:path";

import type { Page } from "@playwright/test";

export async function uploadFile(page: Page, name: string) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page.getByRole("button", { name: "Document TEI" }).click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, `../../testdata/${name}`),
	);
}

export async function uploadUnitexEnrichmentFile(page: Page, name: string) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page
		.getByRole("button", {
			name: "Enrichissement Unitex",
		})
		.click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, `../../testdata/${name}`),
	);
}

export async function uploadMulticatEnrichmentFile(page: Page, name: string) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page
		.getByRole("button", {
			name: "Enrichissement Multicat",
		})
		.click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, `../../testdata/${name}`),
	);
}

export async function uploadNbEnrichmentFile(page: Page, name: string) {
	const fileChooserPromise = page.waitForEvent("filechooser");
	await page
		.getByRole("button", {
			name: "Enrichissement Nb",
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
