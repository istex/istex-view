import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { nestedListDocument as labelledListDocument } from "./LabelledList.spec";
import { List } from "./List";
import { nestedListDocument as unlabelledListDocument } from "./UnlabelledList.spec";

describe("List", () => {
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

	it("should render a list with head", async () => {
		const document: DocumentJson = {
			tag: "list",
			value: [
				{
					tag: "head",
					value: [
						{
							tag: "#text",
							value: "This is the head",
						},
					],
				},
				{
					tag: "item",
					value: [
						{
							tag: "term",
							value: [
								{
									tag: "#text",
									value: "Term 1: ",
								},
							],
						},
						{
							tag: "gloss",
							value: [
								{
									tag: "#text",
									value: "Definition 1",
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(
			<I18nProvider>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<List data={document} />
				</TagCatalogProvider>
			</I18nProvider>,
		);

		await expect
			.element(screen.getByRole("heading", { name: "This is the head" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("listitem", { name: "Term 1: Definition 1" }))
			.toBeVisible();
	});
});
