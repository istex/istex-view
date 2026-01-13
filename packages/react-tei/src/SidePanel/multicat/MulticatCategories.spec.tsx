import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { tagCatalog } from "../../tags/tagCatalog";
import { MulticatCategories } from "./MulticatCategories";
import type { MulticatCategory } from "./useParseMulticatCategories";

describe("MulticatCategories", () => {
	it("should not render anything if there are no categories", async () => {
		const screen = await render(
			<DocumentContextProvider jsonDocument={[]} multicatEnrichment={[]}>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<MulticatCategories />
				</TagCatalogProvider>
			</DocumentContextProvider>,
		);

		await expect.element(screen.container).toBeEmptyDOMElement();
	});

	it.each<{ scheme: MulticatCategory["scheme"]; label: string }>([
		{ scheme: "inist", label: "INIST" },
		{ scheme: "wos", label: "WoS" },
		{
			scheme: "science_metrix",
			label: "Science-Metrix",
		},
		{ scheme: "scopus", label: "Scopus" },
	])("should render $scheme category", async ({ scheme, label }) => {
		const categories: MulticatCategory[] = [
			{
				scheme,
				keywords: [
					{
						level: 1,
						keyword: [{ tag: "#text", value: "Example Keyword" }],
						children: [],
					},
				],
			},
		];

		const screen = await render(
			<I18nProvider>
				<DocumentContextProvider
					jsonDocument={[]}
					multicatEnrichment={categories}
				>
					<TagCatalogProvider tagCatalog={tagCatalog}>
						<MulticatCategories />
					</TagCatalogProvider>
				</DocumentContextProvider>
			</I18nProvider>,
		);

		await expect
			.element(screen.getByText(`Catégorie ${label}`))
			.toBeInTheDocument();

		await expect
			.element(
				screen.getByRole("treeitem").filter({
					hasText: "1-Example Keyword",
				}),
			)
			.toBeVisible();

		await screen.getByRole("button").click();

		await expect
			.element(
				screen.getByRole("treeitem").filter({
					hasText: "1-Example Keyword",
				}),
			)
			.not.toBeInTheDocument();
	});
});
