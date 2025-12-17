import path from "node:path";

import { expect, test } from "@playwright/test";

test("open a document", async ({ page }) => {
	await page.goto("/");

	const fileChooserPromise = page.waitForEvent("filechooser");
	await page.getByRole("button", { name: "Select a TEI File to View" }).click();
	const fileChooser = await fileChooserPromise;
	await fileChooser.setFiles(
		path.join(import.meta.dirname, "../testdata/document.tei"),
	);

	expect(
		page.getByRole("heading", {
			name: "Sample TEI File",
			level: 1,
		}),
	).toBeVisible();

	expect(
		page.getByRole("heading", {
			name: "Introduction",
			level: 2,
		}),
	).toBeVisible();

	expect(
		page.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit."),
	).toBeVisible();

	expect(
		page.getByRole("heading", {
			name: "Part 1",
			level: 2,
		}),
	).toBeVisible();

	expect(page.getByText("Curabitur pretium tempor iaculis.")).toBeVisible();

	expect(
		page.getByRole("heading", {
			name: "Part 1.1",
			level: 3,
		}),
	).toBeVisible();

	expect(
		page.getByText("Integer faucibus eros eget eleifend convallis."),
	).toBeVisible();

	expect(
		page.getByRole("heading", {
			name: "Acknowledgments",
			level: 2,
		}),
	).toBeVisible();

	expect(page.getByText("Nunc varius hendrerit sodales.")).toBeVisible();
});
