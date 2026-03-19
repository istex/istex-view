import { expect, test } from "@playwright/test";
import { mockIstexApi } from "./support/mockIstexApi";

test("multicat enrichment in panel", async ({ page }) => {
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, {
		ark,
		documentFileName: "footnotes.tei",
		multicatEnrichmentFileName: "multicat-enrichment.tei",
	});
	await page.goto(`/#${encodeURIComponent(ark)}`);

	await expect(
		page.getByRole("button", { name: "Catégorie WOS" }),
	).toBeVisible();

	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-science",
		}),
	).toBeVisible();

	const scienceMetricsButton = page.getByRole("button", {
		name: "Catégorie Science-Metrix",
	});
	await expect(scienceMetricsButton).toBeVisible();

	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-natural sciences",
		}),
	).not.toBeVisible();

	await scienceMetricsButton.click();

	await expect(
		page.getByRole("button", { name: "Catégorie Scopus" }),
	).toBeVisible();
	await expect(
		page.getByRole("treeitem").filter({
			hasText: "1-Physical Sciences",
		}),
	).not.toBeVisible();
});
