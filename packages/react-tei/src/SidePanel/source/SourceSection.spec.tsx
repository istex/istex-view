import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider.js";
import { I18nProvider } from "../../i18n/I18nProvider.js";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider.js";
import { tagCatalog } from "../../tags/tagCatalog.js";
import { SourceSection } from "./SourceSection.js";

describe("SourceSection", () => {
	const jsonDocument = [
		{
			tag: "TEI",
			value: [
				{
					tag: "teiHeader",
					value: [
						{
							tag: "fileDesc",
							value: [
								{
									tag: "sourceDesc",
									value: [
										{
											tag: "biblStruct",
											value: [
												{
													tag: "monogr",
													value: [
														{
															tag: "title",
															attributes: {
																"@type": "main",
																"@level": "m",
															},
															value: [
																{
																	tag: "#text",
																	value: "Main Title of the Document",
																},
															],
														},
														{
															tag: "title",
															attributes: {
																"@type": "sub",
																"@level": "m",
															},
															value: [
																{
																	tag: "#text",
																	value: "Subtitle of the Document",
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
		},
	];
	it("should render source section", async () => {
		const { getByRole, getByText } = await render(<SourceSection />, {
			wrapper: ({ children }) => (
				<I18nProvider>
					<DocumentContextProvider jsonDocument={jsonDocument}>
						<TagCatalogProvider tagCatalog={tagCatalog}>
							{children}
						</TagCatalogProvider>
					</DocumentContextProvider>
				</I18nProvider>
			),
		});

		expect(getByRole("button", { name: "Source" })).toBeInTheDocument();
		expect(getByRole("button", { name: "Source" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);
		expect(getByText("Main Title of the Document")).toBeVisible();
		expect(getByText("Subtitle of the Document")).toBeVisible();
		await getByRole("button", { name: "Source" }).click();
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(getByRole("button", { name: "Source" })).toHaveAttribute(
			"aria-expanded",
			"false",
		);
		expect(getByText("Main Title of the Document")).not.toBeVisible();
		expect(getByText("Subtitle of the Document")).not.toBeVisible();
	});

	it("should not render source section if no title is present", async () => {
		const jsonDocumentWithoutTitle = [
			{
				tag: "TEI",
				value: [],
			},
		];
		const { container } = await render(<SourceSection />, {
			wrapper: ({ children }) => (
				<I18nProvider>
					<DocumentContextProvider jsonDocument={jsonDocumentWithoutTitle}>
						<TagCatalogProvider tagCatalog={tagCatalog}>
							{children}
						</TagCatalogProvider>
					</DocumentContextProvider>
				</I18nProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});
});
