import test, { expect } from "@playwright/test";
import { launchViewer, uploadFile } from "./support/upload";

test("scroll to bib reference from text", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "bibliographicReferences.tei");
	await launchViewer(page);

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
	).toBeInViewport();
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

	const refButton = page.getByRole("button", {
		name: "You shall not pass !",
	});

	await refButton.scrollIntoViewIfNeeded();
	await refButton.click();

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
});

test("scroll into document from bib reference", async ({ page }) => {
	await page.goto("/");
	await uploadFile(page, "bibliographicReferences.tei");
	await launchViewer(page);

	const textWithBibRef = page.getByText(
		"Life is great without it you'd be dead.",
	);
	await expect(textWithBibRef).toBeVisible();
	await expect(textWithBibRef).not.toBeInViewport();

	const gummoRef = page
		.getByLabel("Références bibliographiques (3)")
		.getByRole("button", { name: "Gummo, Korine Harmony 1997 2:423-424" });
	await expect(gummoRef).toBeVisible();
	await gummoRef.scrollIntoViewIfNeeded();
	await gummoRef.click();

	await expect(textWithBibRef).toBeInViewport();
});
