import { expect, test } from "@playwright/test";
import { mockIstexApi } from "./support/mockIstexApi";

test("nb enrichment in panel", async ({ page }) => {
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, {
		ark,
		documentFileName: "nb-document.tei",
		nbEnrichmentFileName: "nb-enrichment.tei",
	});
	await page.goto(`/#${encodeURIComponent(ark)}`);

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
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, {
		ark,
		documentFileName: "nb-document.tei",
		nbEnrichmentFileName: "nb-enrichment.tei",
		multicatEnrichmentFileName: "multicat-enrichment.tei",
	});
	await page.goto(`/#${encodeURIComponent(ark)}`);

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
