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
		expect(screen.container).toBeEmptyDOMElement();
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

		expect(section).toBeVisible();

		const heading = section.getByRole("heading", {
			level: 3,
			name: "Abstract",
		});
		expect(heading).toBeVisible();

		expect(section.getByRole("paragraph")).not.toBeInTheDocument();

		await heading.click();

		expect(
			section.getByRole("paragraph").filter({
				hasText: "This is a simple abstract paragraph.",
			}),
		).toBeVisible();
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
		expect(abstractRegion).toBeVisible();

		await abstractRegion.click();

		const tabs = screen.getByRole("tablist");
		expect(tabs).toBeVisible();

		const englishTab = screen.getByRole("tab", { name: "anglais" });
		const frenchTab = screen.getByRole("tab", { name: "français" });

		expect(englishTab).toBeVisible();
		expect(frenchTab).toBeVisible();

		expect(
			abstractRegion.getByText("This is the English abstract."),
		).toBeVisible();
		expect(
			abstractRegion.getByText("Ceci est le résumé en français."),
		).not.toBeInTheDocument();

		await frenchTab.click();

		expect(
			abstractRegion.getByText("This is the English abstract."),
		).not.toBeInTheDocument();
		expect(
			abstractRegion.getByText("Ceci est le résumé en français."),
		).toBeVisible();
	});
});
