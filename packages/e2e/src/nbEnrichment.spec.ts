import { expect, test } from "@playwright/test";
import {
	uploadFile,
	uploadMulticatEnrichmentFile,
	uploadNbEnrichmentFile,
} from "./support/upload";

test("nb enrichment in panel", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "nb-document.tei");
	await uploadNbEnrichmentFile(page, "nb-enrichment.tei");
	await page.getByRole("button", { name: "Lancer la visionneuse" }).click();

	await expect(
		page.getByRole("button", { name: "Catégorie Inist" }),
	).toBeVisible();
	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-sciences appliquees, technologies et medecines",
		}),
	).toBeVisible();
});

test("support nb enrichment with multicat enrichment", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "nb-document.tei");
	await uploadMulticatEnrichmentFile(page, "multicat-enrichment.tei");
	await uploadNbEnrichmentFile(page, "nb-enrichment.tei");
	await page.getByRole("button", { name: "Lancer la visionneuse" }).click();

	await expect(
		page.getByRole("button", { name: "Catégorie Inist" }),
	).toBeVisible();
	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-sciences appliquees, technologies et medecines",
		}),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Catégorie WOS" }),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Catégorie Science-Metrix" }),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Catégorie Scopus" }),
	).toBeVisible();
});
