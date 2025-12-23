import test, { expect } from "@playwright/test";
import { uploadFile } from "./support/upload";

test("document footnotes panel", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "footnotes.tei");

	await expect(
		page.getByRole("button", { name: "Fermer le panneau latéral" }),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Notes de bas de page" }),
	).toHaveAttribute("aria-expanded", "true");

	const footNoteSection = page.getByLabel("Notes de bas de page");

	await expect(
		footNoteSection.getByText(
			"The latin word for Prettier proving the roman already understood the importance of linting",
		),
	).toBeVisible();
	await expect(
		footNoteSection.getByText(
			"The latin word for Prettier proving the roman already understood the importance of linting",
		),
	).not.toBeInViewport();
	await expect(
		footNoteSection.getByText("May need to be cast first"),
	).toBeVisible();
	await expect(
		footNoteSection.getByText("May need to be cast first"),
	).not.toBeInViewport();
	await expect(
		footNoteSection.getByText("Like a nun but with a c"),
	).toBeVisible();
	await expect(
		footNoteSection.getByText("Like a nun but with a c"),
	).not.toBeInViewport();
	await page.getByRole("button", { name: "Notes de bas de page" }).click();
	await expect(
		page.getByRole("button", { name: "Notes de bas de page" }),
	).toHaveAttribute("aria-expanded", "false");

	await expect(
		footNoteSection.getByText(
			"The latin word for Prettier proving the roman already understood the importance of linting",
		),
	).not.toBeVisible();
	await expect(
		footNoteSection.getByText("May need to be cast first"),
	).not.toBeVisible();
	await expect(
		footNoteSection.getByText("Like a nun but with a c"),
	).not.toBeVisible();

	await page.getByLabel("Fermer le panneau latéral").click();
	expect(
		page.getByRole("button", { name: "Ouvrir le panneau latéral" }),
	).toBeVisible();

	const documentBody = page.getByRole("document");
	await documentBody.getByRole("button", { name: "1" }).click();

	expect(
		page.getByRole("button", { name: "Fermer le panneau latéral" }),
	).toBeVisible();
	await expect(
		page.getByRole("button", { name: "Notes de bas de page" }),
	).toHaveAttribute("aria-expanded", "true");

	await expect(
		page.getByText(
			"The latin word for Prettier proving the roman already understood the importance of linting",
		),
	).toBeVisible();
	await expect(
		page.getByText(
			"The latin word for Prettier proving the roman already understood the importance of linting",
		),
	).toBeInViewport();

	await expect(
		documentBody.getByRole("button", { name: "3" }).first(),
	).toBeVisible();
	await expect(
		documentBody.getByRole("button", { name: "3" }).first(),
	).not.toBeInViewport();

	await footNoteSection.getByRole("button", { name: "3" }).click();
	await expect(
		documentBody.getByRole("button", { name: "3" }).first(),
	).toBeInViewport();
});
