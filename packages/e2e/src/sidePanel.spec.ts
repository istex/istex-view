import { expect, test } from "@playwright/test";
import { mockIstexApi } from "./support/mockIstexApi";

test("document sidePanel keywords section", async ({ page }) => {
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, {
		ark,
		documentFileName: "document-with-keywords.tei",
	});
	await page.goto(`/#${encodeURIComponent(ark)}`);

	await expect(
		page.getByRole("button", { name: "Fermer le panneau latéral" }),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Mots-clés (6)" }),
	).toHaveAttribute("aria-expanded", "true");

	await expect(page.getByText("RDF")).toBeVisible();
	await expect(page.getByText("Turtle")).toBeVisible();
	await expect(page.getByText("Sample Document")).toBeVisible();
	await expect(page.getByText("Literature")).toBeVisible();
	await expect(page.getByText("Mathematics")).toBeVisible();
	await expect(page.getByText("Physics")).toBeVisible();

	await page.getByRole("button", { name: "Mots-clés (6)" }).click();
	await expect(
		page.getByRole("button", { name: "Mots-clés (6)" }),
	).toHaveAttribute("aria-expanded", "false");

	await expect(page.getByText("RDF")).not.toBeVisible();
	await expect(page.getByText("Turtle")).not.toBeVisible();
	await expect(page.getByText("Sample Document")).not.toBeVisible();
	await expect(page.getByText("Literature")).not.toBeVisible();
	await expect(page.getByText("Mathematics")).not.toBeVisible();
	await expect(page.getByText("Physics")).not.toBeVisible();
});

test("tabs without enrichment", async ({ page }) => {
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, {
		ark,
		documentFileName: "unitex-document.tei",
	});
	await page.goto(`/#${encodeURIComponent(ark)}`);

	await expect(
		page.getByRole("tab", { name: "Enrichissements Istex (0)" }),
	).not.toBeEnabled();

	const metadataButton = page.getByRole("tab", {
		name: "Métadonnées éditeur",
	});

	await expect(metadataButton).toHaveAttribute("aria-selected", "true");
	await expect(metadataButton).toBeEnabled();
	await metadataButton.click();

	await expect(
		page.getByRole("button", { name: "Mots-clés (6)" }),
	).toBeVisible();
});

test("tabs with enrichment", async ({ page }) => {
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, {
		ark,
		documentFileName: "unitex-document.tei",
		unitexEnrichmentFileName: "unitex-enrichment.tei",
	});
	await page.goto(`/#${encodeURIComponent(ark)}`);

	const enrichmentButton = page.getByRole("tab", {
		name: "Enrichissements Istex (3)",
	});
	await expect(enrichmentButton).toBeEnabled();
	await expect(enrichmentButton).toHaveAttribute("aria-selected", "true");

	await expect(
		page.getByRole("button", {
			name: "Nom d'organisation (Unitex) (1)",
		}),
	).toBeVisible();

	const metadataButton = page.getByRole("tab", {
		name: "Métadonnées éditeur",
	});
	await expect(metadataButton).toBeEnabled();
	await metadataButton.click();

	await expect(
		page.getByRole("button", { name: "Mots-clés (6)" }),
	).toBeVisible();
});
