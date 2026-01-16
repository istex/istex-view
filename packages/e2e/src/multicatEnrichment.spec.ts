import { expect, test } from "@playwright/test";
import { uploadFile, uploadMulticatEnrichmentFile } from "./support/upload";

test("multicat enrichment in panel", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "multicat-document.tei");
	await uploadMulticatEnrichmentFile(page, "multicat-enrichment.tei");
	await page.getByRole("button", { name: "Lancer la visionneuse" }).click();

	await expect(
		page.getByRole("button", { name: "Catégorie WOS" }),
	).toBeVisible();

	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-science",
		}),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Catégorie Science-Metrix" }),
	).toBeVisible();

	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-natural sciences",
		}),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Catégorie Scopus" }),
	).toBeVisible();
	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-Physical Sciences",
		}),
	).toBeVisible();
});
