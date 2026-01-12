import { expect, test } from "@playwright/test";
import { uploadFile, uploadUnitexEnrichmentFile } from "./support/upload";

test("unitex enrichment highlight in viewer", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "unitex-document.tei");
	await uploadUnitexEnrichmentFile(page, "unitex-enrichment.tei");
	await page.getByRole("button", { name: "Lancer la visionneuse" }).click();

	await expect(
		page.getByRole("button", { name: "Nom de lieu administratif (1)" }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Nom de lieu administratif (1)" }),
	).toHaveAttribute("aria-expanded", "true");

	await expect(page.getByText("Nancy | 3", { exact: true })).toBeVisible();

	await expect(page.locator('[data-group="placeName"]')).toHaveCount(3);

	const nancyHighlights = page.locator('[data-term="nancy"]');
	await expect(nancyHighlights).toHaveCount(3);
	for (const nancyHighlight of await nancyHighlights.all()) {
		await expect(nancyHighlight).toHaveAttribute("data-group", "placeName");
	}

	await expect(
		page.getByRole("button", { name: "Nom d'organisation (1)" }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Nom d'organisation (1)" }),
	).toHaveAttribute("aria-expanded", "true");
	await expect(page.getByText("SNCF | 2", { exact: true })).toBeVisible();
	await expect(page.locator('[data-term="sncf"]')).toHaveCount(2);
	await expect(page.locator('[data-group="orgName"]')).toHaveCount(2);
	const sncfHighlights = page.locator('[data-term="sncf"]');
	for (const sncfHighlight of await sncfHighlights.all()) {
		await expect(sncfHighlight).toHaveAttribute("data-group", "orgName");
	}

	await expect(
		page.getByRole("button", { name: "Noms de personnes (2)" }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Noms de personnes (2)" }),
	).toHaveAttribute("aria-expanded", "true");
	await expect(page.getByText("Leo | 3", { exact: true })).toBeVisible();
	await expect(page.getByText("Eros | 1", { exact: true })).toBeVisible();
	await expect(page.locator('[data-term="leo"]')).toHaveCount(3);
	await expect(page.locator('[data-term="eros"]')).toHaveCount(1);
	await expect(page.locator('[data-group="persName"]')).toHaveCount(4);

	const leoHighlights = page.locator('[data-term="leo"]');
	for (const leoHighlight of await leoHighlights.all()) {
		await expect(leoHighlight).toHaveAttribute("data-group", "persName");
	}

	const erosHighlights = page.locator('[data-term="eros"]');
	for (const erosHighlight of await erosHighlights.all()) {
		await expect(erosHighlight).toHaveAttribute("data-group", "persName");
	}
});
