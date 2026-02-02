import List from "@mui/material/List";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { LabelledItem } from "./LabelledItem";
import { labelledListSx } from "./LabelledList";

export const simpleItemDocument: DocumentJson = {
	tag: "item",
	attributes: {},
	value: [
		{
			tag: "label",
			value: [
				{
					tag: "highlightedText",
					value: [
						{
							tag: "#text",
							value: "1.b.I.iii",
						},
					],
				},
			],
		},
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
			tag: "label",
			value: [
				{
					tag: "highlightedText",
					value: [
						{
							tag: "#text",
							value: "1.b.I.iii",
						},
					],
				},
			],
		},
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
							value: [
								{
									tag: "label",
									value: [
										{
											tag: "highlightedText",
											value: [
												{
													tag: "#text",
													value: "1.b.I.iii.a",
												},
											],
										},
									],
								},
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

export function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				<List sx={labelledListSx}>{children}</List>
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("LabelledItem", () => {
	it("should render a simple item", async () => {
		const screen = await render(<LabelledItem data={simpleItemDocument} />, {
			wrapper: TestWrapper,
		});

		const item = screen.getByRole("listitem", {
			name: "Lorem",
		});
		await expect.element(item).toBeVisible();
		await expect.element(item).toHaveTextContent("1.b.I.iiiLorem");
	});

	it("should render an item with nested list", async () => {
		const screen = await render(<LabelledItem data={nestedListDocument} />, {
			wrapper: TestWrapper,
		});

		const item = screen.getByRole("listitem", {
			name: "Lorem",
		});
		await expect.element(item).toBeVisible();
		await expect
			.element(item)
			.toHaveTextContent("1.b.I.iiiLorem1.b.I.iii.aIpsum");

		const nestedList = item.getByRole("list");
		await expect.element(nestedList).toBeVisible();
		await expect.element(nestedList).toHaveTextContent("1.b.I.iii.aIpsum");
		const nestedItem = nestedList.getByRole("listitem", {
			name: "Ipsum",
		});
		await expect.element(nestedItem).toBeVisible();
		await expect.element(nestedItem).toHaveTextContent("1.b.I.iii.aIpsum");
	});

	it("should only render content when label is missing", async () => {
		const incompleteItemDocument: DocumentJson = {
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
									value: "Lorem",
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(
			<LabelledItem data={incompleteItemDocument} />,
			{
				wrapper: TestWrapper,
			},
		);

		const item = screen.getByRole("listitem");
		await expect.element(item).toBeVisible();
		await expect.element(item).toHaveTextContent("Lorem");
	});
});
