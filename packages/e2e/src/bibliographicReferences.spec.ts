import test, { expect } from "@playwright/test";
import { uploadFile } from "./support/upload";

test("document bibliographic references panel", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "bibliographicReferences.tei");

	await expect(
		page.getByRole("button", { name: "Fermer le panneau latéral" }),
	).toBeVisible();

	await expect(
		page.getByRole("button", { name: "Références bibliographiques (3)" }),
	).toHaveAttribute("aria-expanded", "true");

	const bibRefSection = page.getByLabel("Références bibliographiques (3)");

	await expect(
		bibRefSection.getByText(
			"The Fellowship of the Ring By Gandalf The Gray (1954) Lord of the ring 1 321 -322",
		),
	).toBeVisible();
	await expect(
		bibRefSection.getByText(
			"The Fellowship of the Ring By Gandalf The Gray (1954) Lord of the ring 1 321 -322",
		),
	).toBeInViewport();
	await expect(
		bibRefSection.getByText("Gummo, Korine Harmony 1997 2:423-424"),
	).toBeVisible();
	await expect(
		bibRefSection.getByText("Gummo, Korine Harmony 1997 2:423-424"),
	).not.toBeInViewport();
	await expect(
		bibRefSection.getByText("Foundation Isaac Aasimov 1957 GnomePress 5"),
	).toBeVisible();
	await expect(
		bibRefSection.getByText("Foundation Isaac Aasimov 1957 GnomePress 5"),
	).not.toBeInViewport();
	await page
		.getByRole("button", { name: "Références bibliographiques (3)" })
		.click();
	await expect(
		page.getByRole("button", { name: "Références bibliographiques (3)" }),
	).toHaveAttribute("aria-expanded", "false");

	await expect(
		bibRefSection.getByText(
			"The Fellowship of the Ring By Gandalf The Gray (1954) Lord of the ring 1 321 -322",
		),
	).not.toBeVisible();
	await expect(
		bibRefSection.getByText("Gummo, Korine Harmony 1997 2:423-424"),
	).not.toBeVisible();

	await page.getByLabel("Fermer le panneau latéral").click();
	expect(
		page.getByRole("button", { name: "Ouvrir le panneau latéral" }),
	).toBeVisible();

	await page.getByText("You shall not pass !").click();
	await expect(
		page.getByRole("button", { name: "Références bibliographiques (3)" }),
	).toHaveAttribute("aria-expanded", "true");

	await expect(
		bibRefSection.getByText(
			"The Fellowship of the Ring By Gandalf The Gray (1954) Lord of the ring 1 321 -322",
		),
	).toBeVisible();

	await expect(
		bibRefSection.getByText(
			"The Fellowship of the Ring By Gandalf The Gray (1954) Lord of the ring 1 321 -322",
		),
	).toBeInViewport();
	await expect(
		bibRefSection.getByText("Gummo, Korine Harmony 1997 2:423-424"),
	).toBeVisible();
	await expect(
		bibRefSection.getByText("Foundation Isaac Aasimov 1957 GnomePress 5"),
	).toBeVisible();

	await expect(
		page.getByText("Life is great without it you'd be dead."),
	).toBeVisible();
	await expect(
		page.getByText("Life is great without it you'd be dead."),
	).not.toBeInViewport();

	await page.getByLabel("Gummo, Korine Harmony 1997 2:423-424").click();
	await expect(
		page.getByText("Life is great without it you'd be dead."),
	).toBeInViewport();
});
