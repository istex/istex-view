import { expect, test } from "@playwright/test";
import { mockIstexApi } from "./support/mockIstexApi";

test("open a document", async ({ page }) => {
	const ark = "ark:/67375/MY-FAKE-ARK";
	await mockIstexApi(page, { ark, documentFileName: "document.tei" });
	await page.goto(`/#${encodeURIComponent(ark)}`);

	await expect(
		page.getByRole("heading", {
			name: "Sample TEI File",
			level: 1,
		}),
	).toBeVisible();

	await expect(
		page.getByRole("heading", {
			name: "Introduction",
			level: 2,
		}),
	).toBeVisible();

	await expect(
		page.getByText("Lorem ipsum dolor sit amet, consectetur adipiscing elit."),
	).toBeVisible();

	await expect(
		page.getByRole("heading", {
			name: "Part 1",
			level: 2,
		}),
	).toBeVisible();

	await expect(
		page.getByText("Curabitur pretium tempor iaculis."),
	).toBeVisible();

	await expect(
		page.getByRole("heading", {
			name: "Part 1.1",
			level: 3,
		}),
	).toBeVisible();

	await expect(
		page.getByText("Integer faucibus eros eget eleifend convallis."),
	).toBeVisible();

	await expect(
		page.getByRole("heading", {
			name: "Acknowledgments",
			level: 2,
		}),
	).toBeVisible();

	await expect(page.getByText("Nunc varius hendrerit sodales.")).toBeVisible();
});
