import List from "@mui/material/List";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { labelledListSx } from "./LabelledList";
import { UnlabelledItem } from "./UnlabelledItem";

export const simpleItemDocument: DocumentJson = {
	tag: "item",
	attributes: {},
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
};

export const nestedListDocument: DocumentJson = {
	tag: "item",
	attributes: {},
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
				{
					tag: "list",
					attributes: {},
					value: [
						{
							tag: "item",
							attributes: {},
							value: [
								{
									tag: "p",
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
								},
							],
						},
					],
				},
			],
		},
	],
};

export const itemWithoutParagraphDocument: DocumentJson = {
	tag: "item",
	attributes: {},
	value: [
		{
			tag: "hi",
			value: [
				{
					tag: "highlightedText",
					value: [
						{
							tag: "#text",
							value: "NoParagraph",
						},
					],
				},
			],
			attributes: {
				"@rend": "italic",
			},
		},
	],
};

export function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				<List sx={labelledListSx}>{children}</List>
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("UnlabelledItem", () => {
	it("should render a simple item", async () => {
		const screen = await render(<UnlabelledItem data={simpleItemDocument} />, {
			wrapper: TestWrapper,
		});

		const item = screen.getByRole("listitem", {
			name: "Lorem",
		});
		await expect.element(item).toBeVisible();
		await expect.element(item).toHaveTextContent("Lorem");
	});

	it("should render an item with nested list", async () => {
		const screen = await render(<UnlabelledItem data={nestedListDocument} />, {
			wrapper: TestWrapper,
		});

		const item = screen.getByRole("listitem", {
			name: "Lorem",
		});
		await expect.element(item).toBeVisible();
		await expect.element(item).toHaveTextContent("LoremIpsum");

		const nestedList = item.getByRole("list");
		await expect.element(nestedList).toBeVisible();
		await expect.element(nestedList).toHaveTextContent("Ipsum");
		const nestedItem = nestedList.getByRole("listitem", {
			name: "Ipsum",
		});
		await expect.element(nestedItem).toBeVisible();
		await expect.element(nestedItem).toHaveTextContent("Ipsum");
	});

	it("should support item without paragraph and fall back to raw rendering", async () => {
		const screen = await render(
			<UnlabelledItem data={itemWithoutParagraphDocument} />,
			{
				wrapper: TestWrapper,
			},
		);

		const item = screen.getByRole("listitem", {
			name: "NoParagraph",
		});
		await expect.element(item).toBeVisible();
		await expect.element(item).toHaveTextContent("NoParagraph");
	});
});
