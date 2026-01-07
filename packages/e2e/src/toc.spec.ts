import { expect, test } from "@playwright/test";
import { launchViewer, uploadFile } from "./support/upload";

test("renders a table of contents and allows navigation", async ({ page }) => {
	await page.setViewportSize({ width: 1920, height: 1080 });
	await page.goto("/");
	await uploadFile(page, "toc.tei");
	await launchViewer(page);

	await expect(page.getByRole("tree")).toBeVisible();

	await expect(
		page.getByRole("treeitem", {
			name: "Introduction",
		}),
	).toBeVisible();

	await expect(
		page.getByRole("treeitem", {
			name: "Part 1",
			exact: true,
		}),
	).toBeVisible();

	await expect(
		page.getByRole("treeitem", {
			name: "Part 1.1",
		}),
	).toBeVisible();

	await expect(
		page.getByRole("treeitem", {
			name: "Acknowledgments",
		}),
	).toBeVisible();
});

test("render current element", async ({ page }) => {
	await page.setViewportSize({ width: 1920, height: 1080 });
	await page.goto("/");
	await uploadFile(page, "toc.tei");
	await launchViewer(page);

	await expect(page.getByRole("tree")).toBeVisible();

	const introduction = page.getByRole("treeitem", {
		name: "Introduction",
	});
	await expect(introduction).toBeVisible();
	await expect(introduction).toHaveAttribute("aria-current", "true");

	const part11 = page.getByRole("treeitem", {
		name: "Part 1.1",
	});
	await expect(part11).toBeVisible();

	await part11.click();

	await expect(part11).toHaveAttribute("aria-current", "true", {
		timeout: 2000,
	});
});
