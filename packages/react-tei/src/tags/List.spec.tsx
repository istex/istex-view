import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import { List } from "./List";
import { nestedListDocument as labelledListDocument } from "./list/LabelledList.spec";
import { nestedListDocument as unlabelledListDocument } from "./list/UnlabelledList.spec";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("list", () => {
	it("should render a labelled list", async () => {
		const screen = await render(
			<I18nProvider>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<List data={labelledListDocument} />
				</TagCatalogProvider>
			</I18nProvider>,
		);

		const outerList = screen.getByRole("list").nth(0);
		await expect.element(outerList).toBeVisible();
		await expect
			.element(outerList.getByRole("listitem", { name: "Lorem" }))
			.toBeVisible();

		const ipsumItem = outerList.getByRole("listitem", { name: "Ipsum" });
		await expect.element(ipsumItem).toBeVisible();

		const innerList = ipsumItem.getByRole("list");
		await expect.element(innerList).toBeVisible();
		await expect
			.element(innerList.getByRole("listitem", { name: "Dolor" }))
			.toBeVisible();
	});

	it("should render an unlabelled list", async () => {
		const screen = await render(
			<I18nProvider>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<List data={unlabelledListDocument} />
				</TagCatalogProvider>
			</I18nProvider>,
		);

		const outerList = screen.getByRole("list").nth(0);
		await expect.element(outerList).toBeVisible();
		await expect
			.element(outerList.getByRole("listitem", { name: "Lorem" }))
			.toBeVisible();

		const ipsumItem = outerList.getByRole("listitem", { name: "Ipsum" });
		await expect.element(ipsumItem).toBeVisible();

		screen.debug(ipsumItem);

		const innerList = ipsumItem.getByRole("list");
		await expect.element(innerList).toBeInTheDocument();
		await expect
			.element(innerList.getByRole("listitem", { name: "Dolor" }))
			.toBeVisible();
	});
});
