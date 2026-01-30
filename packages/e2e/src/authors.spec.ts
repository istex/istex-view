import { expect, test } from "@playwright/test";
import { launchViewer, uploadFile } from "./support/upload";

test("document authors section", async ({ page }) => {
	await page.goto("/");

	await uploadFile(page, "document.tei");
	await launchViewer(page);

	const authorButton = page.getByRole("button", { name: "Auteurs" });
	await expect(authorButton).toHaveAttribute("aria-expanded", "false");
	await authorButton.click();
	await expect(authorButton).toHaveAttribute("aria-expanded", "true");

	await expect(
		page.getByLabel("Auteur", {
			exact: true,
		}),
	).toHaveCount(6);
	await expect(page.getByText("Victor Hugo")).toBeVisible();
	await expect(page.getByText("Jean Paul II")).toBeVisible();
	await expect(page.getByText("Jean De La Fontaine")).toBeVisible();
	await expect(page.getByText("Marie Curie")).toBeVisible();
	await expect(page.getByText("Dead Poets Society")).toBeVisible();
	await expect(page.getByText("et al.")).toBeVisible();
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.nth(0),
	).toHaveText("Victor Hugo");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.nth(0)
			.getByText("Victor"),
	).toBeVisible();
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.nth(1),
	).toHaveText("Jean Paul II");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.nth(2),
	).toHaveText("Jean De La Fontaine");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.nth(3),
	).toHaveText("Marie Curie");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.nth(4),
	).toHaveText("Dead Poets Society");

	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.getByText("Victor"),
	).toHaveAttribute("aria-description", "Prénom");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.getByText("Hugo"),
	).toHaveAttribute("aria-description", "Nom");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.getByText("II"),
	).toHaveAttribute("aria-description", "Génération");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.getByText("De", {
				exact: true,
			}),
	).toHaveAttribute("aria-description", "Particule");
	await expect(
		page
			.getByLabel("Auteur", {
				exact: true,
			})
			.getByText("Dead Poets Society"),
	).toHaveAttribute("aria-description", "Organisation");

	await page.getByRole("button", { name: "Auteurs" }).click();
	await expect(page.getByRole("button", { name: "Auteurs" })).toHaveAttribute(
		"aria-expanded",
		"false",
	);
});
