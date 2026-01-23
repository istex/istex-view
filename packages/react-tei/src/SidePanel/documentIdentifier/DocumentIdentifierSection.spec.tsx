import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { tagCatalog } from "../../tags/tagCatalog";
import { DocumentIdentifierSection } from "./DocumentIdentifierSection";

describe("DocumentIdentifierSection", () => {
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
													tag: "analytic",
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
																	value: "Analytic Title",
																},
															],
														},
														{
															tag: "idno",
															attributes: {
																"@type": "DOI",
															},
															value: [
																{
																	tag: "#text",
																	value: "10.1000/182/xyz",
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
		const { getByRole, getByText } = await render(
			<DocumentIdentifierSection />,
			{
				wrapper: ({ children }) => (
					<I18nProvider>
						<DocumentContextProvider jsonDocument={jsonDocument}>
							<TagCatalogProvider tagCatalog={tagCatalog}>
								{children}
							</TagCatalogProvider>
						</DocumentContextProvider>
					</I18nProvider>
				),
			},
		);

		await expect
			.element(getByRole("button", { name: "Identifiant du document" }))
			.toBeInTheDocument();
		await expect
			.element(getByRole("button", { name: "Identifiant du document" }))
			.toHaveAttribute("aria-expanded", "true");
		await expect.element(getByText("10.1000/182/xyz")).toBeVisible();
		await getByRole("button", { name: "Identifiant du document" }).click();
		await new Promise((resolve) => setTimeout(resolve, 300));
		await expect
			.element(getByRole("button", { name: "Identifiant du document" }))
			.toHaveAttribute("aria-expanded", "false");
		await expect.element(getByText("10.1000/182/xyz")).not.toBeVisible();
	});

	it("should not render source section if no analytic doi is present", async () => {
		const jsonDocumentWithoutTitle = [
			{
				tag: "TEI",
				value: [],
			},
		];
		const { container } = await render(<DocumentIdentifierSection />, {
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
