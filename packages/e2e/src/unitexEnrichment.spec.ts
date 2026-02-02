import { expect, test } from "@playwright/test";
import { uploadFile, uploadUnitexEnrichmentFile } from "./support/upload";

test("unitex enrichment highlight in viewer", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "unitex-document.tei");
	await uploadUnitexEnrichmentFile(page, "unitex-enrichment.tei");
	await page.getByRole("button", { name: "Lancer la visionneuse" }).click();

	const administrativePlaceButton = page.getByRole("button", {
		name: "Nom de lieu administratif (1)",
	});
	await expect(administrativePlaceButton).toBeVisible();
	await expect(administrativePlaceButton).toHaveAttribute(
		"aria-expanded",
		"false",
	);

	await administrativePlaceButton.click();
	await expect(administrativePlaceButton).toHaveAttribute(
		"aria-expanded",
		"true",
	);

	await expect(page.getByLabel("Nancy", { exact: true })).toBeVisible();

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
	await expect(page.getByLabel("SNCF", { exact: true })).toBeVisible();
	await expect(page.locator('[data-term="sncf"]')).toHaveCount(2);
	await expect(page.locator('[data-group="orgName"]')).toHaveCount(2);
	const sncfHighlights = page.locator('[data-term="sncf"]');
	for (const sncfHighlight of await sncfHighlights.all()) {
		await expect(sncfHighlight).toHaveAttribute("data-group", "orgName");
	}

	const personalNameButton = page.getByRole("button", {
		name: "Noms de personnes (2)",
	});
	await expect(personalNameButton).toBeVisible();
	await expect(personalNameButton).toHaveAttribute("aria-expanded", "false");

	await personalNameButton.click();
	await expect(personalNameButton).toHaveAttribute("aria-expanded", "true");
	await expect(page.getByLabel("Leo", { exact: true })).toBeVisible();
	await expect(page.getByLabel("Eros", { exact: true })).toBeVisible();
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
