import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { UnlabelledList } from "./UnlabelledList";

export const simpleListDocument: DocumentJson = {
	tag: "list",
	attributes: {},
	value: [
		{
			tag: "item",
			value: [
				{
					tag: "p",
					value: [
						{
							tag: "hi",
							value: [
								{
									tag: "highlightedText",
									value: [
										{
											tag: "#text",
											value: "Lorem",
										},
									],
								},
							],
							attributes: {
								"@rend": "italic",
							},
						},
					],
				},
			],
		},
		{
			tag: "item",
			value: [
				{
					tag: "p",
					value: [
						{
							tag: "hi",
							value: [
								{
									tag: "highlightedText",
									value: [
										{
											tag: "#text",
											value: "Ipsum",
										},
									],
								},
							],
							attributes: {
								"@rend": "italic",
							},
						},
					],
				},
			],
		},
	],
};

export const nestedListDocument: DocumentJson = {
	tag: "list",
	attributes: {},
	value: [
		{
			tag: "item",
			value: [
				{
					tag: "p",
					value: [
						{
							tag: "hi",
							value: [
								{
									tag: "highlightedText",
									value: [
										{
											tag: "#text",
											value: "Lorem",
										},
									],
								},
							],
							attributes: {
								"@rend": "italic",
							},
						},
					],
				},
			],
		},
		{
			tag: "item",
			value: [
				{
					tag: "p",
					value: [
						{
							tag: "hi",
							value: [
								{
									tag: "highlightedText",
									value: [
										{
											tag: "#text",
											value: "Ipsum",
										},
									],
								},
							],
							attributes: {
								"@rend": "italic",
							},
						},
						{
							tag: "list",
							attributes: {},
							value: [
								{
									tag: "item",
									value: [
										{
											tag: "p",
											value: [
												{
													tag: "highlightedText",
													value: [
														{
															tag: "#text",
															value: "Dolor",
														},
													],
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	],
};

describe("UnlabelledList", () => {
	it("should render a list with multiple items", async () => {
		const screen = await render(
			<I18nProvider>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<UnlabelledList data={simpleListDocument} />
				</TagCatalogProvider>
			</I18nProvider>,
		);

		const list = screen.getByRole("list");
		await expect.element(list).toBeVisible();

		await expect
			.element(list.getByRole("listitem", { name: "Lorem" }))
			.toBeVisible();
		await expect
			.element(list.getByRole("listitem", { name: "Ipsum" }))
			.toBeVisible();
	});

	it("should render a list with nested lists", async () => {
		const screen = await render(
			<I18nProvider>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<UnlabelledList data={nestedListDocument} />
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
		await expect.element(innerList).toBeInTheDocument();
		await expect
			.element(innerList.getByRole("listitem", { name: "Dolor" }))
			.toBeVisible();
	});

	it("should render a list with head", async () => {
		const documentWithHead: DocumentJson = {
			tag: "list",
			attributes: {},
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
							tag: "p",
							value: [
								{
									tag: "#text",
									value: "Term 1: Definition 1",
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
					<UnlabelledList data={documentWithHead} />
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
