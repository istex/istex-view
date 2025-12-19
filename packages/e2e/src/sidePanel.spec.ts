import { expect, test } from "@playwright/test";
import { uploadFile } from "./support/upload";

test("open a document", async ({ page }) => {
	await page.goto("/");

	await uploadFile(page, "document.tei");

	await expect(
		page.getByRole("button", { name: "Fermer le panneau latéral" }),
	).toBeVisible();

	await expect(page.getByRole("button", { name: "Auteurs" })).toHaveAttribute(
		"aria-expanded",
		"true",
	);

	await expect(page.getByLabel("Auteur")).toHaveCount(5);
	await expect(page.getByText("Mr Victor Hugo")).toBeVisible();
	await expect(page.getByText("Jean Paul II")).toBeVisible();
	await expect(page.getByText("Jean De La Fontaine")).toBeVisible();
	await expect(page.getByText("Dr Marie Curie PhD")).toBeVisible();
	await expect(page.getByText("Dead Poets Society")).toBeVisible();
	await expect(page.getByLabel("Auteur").nth(0)).toHaveText("Mr Victor Hugo");
	await expect(
		page.getByLabel("Auteur").nth(0).getByText("Victor"),
	).toBeVisible();
	await expect(page.getByLabel("Auteur").nth(1)).toHaveText("Jean Paul II");
	await expect(page.getByLabel("Auteur").nth(2)).toHaveText(
		"Jean De La Fontaine",
	);
	await expect(page.getByLabel("Auteur").nth(3)).toHaveText(
		"Dr Marie Curie PhD",
	);
	await expect(page.getByLabel("Auteur").nth(4)).toHaveText(
		"Dead Poets Society",
	);

	await expect(page.getByLabel("Auteur").getByText("Victor")).toHaveAttribute(
		"aria-description",
		"Prénom",
	);
	await expect(page.getByLabel("Auteur").getByText("Hugo")).toHaveAttribute(
		"aria-description",
		"Nom",
	);
	await expect(page.getByLabel("Auteur").getByText("Mr")).toHaveAttribute(
		"aria-description",
		"Civilité",
	);
	await expect(page.getByLabel("Auteur").getByText("Dr")).toHaveAttribute(
		"aria-description",
		"Civilité",
	);
	await expect(page.getByLabel("Auteur").getByText("PhD")).toHaveAttribute(
		"aria-description",
		"Diplôme",
	);
	await expect(page.getByLabel("Auteur").getByText("II")).toHaveAttribute(
		"aria-description",
		"Génération",
	);
	await expect(
		page.getByLabel("Auteur").getByText("De", {
			exact: true,
		}),
	).toHaveAttribute("aria-description", "Particule");
	await expect(
		page.getByLabel("Auteur").getByText("Dead Poets Society"),
	).toHaveAttribute("aria-description", "Organisation");

	await page.getByRole("button", { name: "Auteurs" }).click();
	await expect(page.getByRole("button", { name: "Auteurs" })).toHaveAttribute(
		"aria-expanded",
		"false",
	);

	await expect(
		page.getByRole("button", { name: "Fermer le panneau latéral" }),
	).toBeVisible();

	await page.getByLabel("Fermer le panneau latéral").click();
	expect(
		page.getByRole("button", { name: "Ouvrir le panneau latéral" }),
	).toBeVisible();
});
