import { expect, test } from "@playwright/test";
import { launchViewer, uploadFile } from "./support/upload";

test("document sidePanel keywords section", async ({ page }) => {
	await page.goto("/");

	await uploadFile(page, "document-with-keywords.tei");
	await launchViewer(page);

	await expect(
		page.getByRole("button", { name: "Fermer le panneau latéral" }),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Mots-clés (6)" }),
	).toHaveAttribute("aria-expanded", "true");

	await expect(page.getByText("TEI")).toBeVisible();
	await expect(page.getByText("XML")).toBeVisible();
	await expect(page.getByText("Sample Document")).toBeVisible();
	await expect(page.getByText("Literature")).toBeVisible();
	await expect(page.getByText("Mathematics")).toBeVisible();
	await expect(page.getByText("Physics")).toBeVisible();

	await page.getByRole("button", { name: "Mots-clés (6)" }).click();
	await expect(
		page.getByRole("button", { name: "Mots-clés (6)" }),
	).toHaveAttribute("aria-expanded", "false");

	await expect(page.getByText("TEI")).not.toBeVisible();
	await expect(page.getByText("XML")).not.toBeVisible();
	await expect(page.getByText("Sample Document")).not.toBeVisible();
	await expect(page.getByText("Literature")).not.toBeVisible();
	await expect(page.getByText("Mathematics")).not.toBeVisible();
	await expect(page.getByText("Physics")).not.toBeVisible();
});
