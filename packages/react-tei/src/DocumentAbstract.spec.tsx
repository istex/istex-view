import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentAbstract } from "./DocumentAbstract";
import { I18nProvider } from "./i18n/I18nProvider";
import type { DocumentJson, DocumentJsonValue } from "./parser/document";
import { TagCatalogProvider } from "./tags/TagCatalogProvider";
import { tagCatalog } from "./tags/tagCatalog";

describe("DocumentAbstract", () => {
	it.each<DocumentJsonValue>([
		[],
		[
			{
				tag: "fileDesc",
				attributes: {},
				value: [],
			},
			{
				tag: "profileDesc",
				attributes: {},
				value: [],
			},
		],
	])("should render nothing if no abstract is present", async (value) => {
		const headerJson: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value,
		};

		const screen = await render(<DocumentAbstract teiHeader={headerJson} />, {
			wrapper: ({ children }) => (
				<I18nProvider>
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				</I18nProvider>
			),
		});
		await expect.element(screen.container).toBeEmptyDOMElement();
	});

	it("should support non multi-lingual abstracts", async () => {
		const headerJson: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "fileDesc",
					attributes: {},
					value: [],
				},
				{
					tag: "profileDesc",
					attributes: {},
					value: [
						{
							tag: "abstract",
							attributes: {},
							value: [
								{
									tag: "head",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "Abstract",
										},
									],
								},
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "This is a simple ",
										},
										{
											tag: "hi",
											attributes: {},
											value: [
												{
													tag: "#text",
													attributes: {},
													value: "abstract",
												},
											],
										},

										{
											tag: "#text",
											attributes: {},
											value: " paragraph.",
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(<DocumentAbstract teiHeader={headerJson} />, {
			wrapper: ({ children }) => (
				<I18nProvider>
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				</I18nProvider>
			),
		});

		const section = screen.getByRole("region", {
			name: "Abstract",
		});

		await expect.element(section).toBeVisible();

		const heading = section.getByRole("heading", {
			level: 3,
			name: "Abstract",
		});
		await expect.element(heading).toBeVisible();

		await expect
			.element(section.getByRole("paragraph"))
			.not.toBeInTheDocument();

		await heading.click();

		await expect
			.element(
				section.getByRole("paragraph").filter({
					hasText: "This is a simple abstract paragraph.",
				}),
			)
			.toBeVisible();
	});

	it("should support multi-lingual abstracts", async () => {
		const headerJson: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "fileDesc",
					attributes: {},
					value: [],
				},
				{
					tag: "profileDesc",
					attributes: {},
					value: [
						{
							tag: "abstract",
							attributes: { "@xml:lang": "en" },
							value: [
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "This is the English abstract.",
										},
									],
								},
							],
						},
						{
							tag: "abstract",
							attributes: { "@xml:lang": "fr" },
							value: [
								{
									tag: "p",
									attributes: {},
									value: [
										{
											tag: "#text",
											attributes: {},
											value: "Ceci est le résumé en français.",
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(<DocumentAbstract teiHeader={headerJson} />, {
			wrapper: ({ children }) => (
				<I18nProvider>
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				</I18nProvider>
			),
		});

		const abstractRegion = screen.getByRole("region", {
			name: "Résumé",
		});
		await expect.element(abstractRegion).toBeVisible();

		await abstractRegion.click();

		const tabs = screen.getByRole("tablist");
		await expect.element(tabs).toBeVisible();

		const englishTab = screen.getByRole("tab", { name: "anglais" });
		const frenchTab = screen.getByRole("tab", { name: "français" });

		await expect.element(englishTab).toBeVisible();
		await expect.element(frenchTab).toBeVisible();

		await expect
			.element(abstractRegion.getByText("This is the English abstract."))
			.toBeVisible();
		await expect
			.element(abstractRegion.getByText("Ceci est le résumé en français."))
			.not.toBeInTheDocument();

		await frenchTab.click();

		await expect
			.element(abstractRegion.getByText("This is the English abstract."))
			.not.toBeInTheDocument();
		await expect
			.element(abstractRegion.getByText("Ceci est le résumé en français."))
			.toBeVisible();
	});
});
