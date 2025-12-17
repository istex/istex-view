import { expect, test } from "@playwright/test";
import { uploadFile } from "./support/upload";

test("render a table", async ({ page }) => {
	await page.goto("/");

	await uploadFile(page, "table.tei");

	await expect(page.getByRole("table")).toBeVisible();

	await expect(
		page.getByRole("columnheader", { name: "Header 1" }),
	).toBeVisible();
	await expect(
		page.getByRole("columnheader", { name: "Header 2" }),
	).toBeVisible();

	await expect(page.getByRole("cell", { name: "Data 1" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Data 2" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Data 3" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Data 4" })).toBeVisible();
});

test("render a table with caption and notes", async ({ page }) => {
	await page.goto("/");

	await uploadFile(page, "table-with-notes.tei");

	await expect(
		page.getByRole("table", {
			name: "Table 1: Sample Table",
		}),
	).toBeVisible();

	await expect(page.getByRole("caption")).toBeVisible();
	await expect(page.getByRole("caption")).toHaveText("Table 1: Sample Table");

	await expect(
		page.getByRole("columnheader", { name: "Header 1" }),
	).toBeVisible();
	await expect(
		page.getByRole("columnheader", { name: "Header 2" }),
	).toBeVisible();

	await expect(page.getByRole("cell", { name: "Data 1" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Data 2" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Data 3" })).toBeVisible();
	await expect(page.getByRole("cell", { name: "Data 4" })).toBeVisible();

	await expect(page.getByText("This is a table note.")).toBeVisible();
});
