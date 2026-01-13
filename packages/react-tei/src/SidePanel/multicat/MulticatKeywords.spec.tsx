import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { tagCatalog } from "../../tags/tagCatalog";
import { MulticatKeywords } from "./MulticatKeywords";
import type { Keywords } from "./useParseMulticatCategories";

describe("MulticatKeywords", () => {
	it("should render keywords as a tree structure", async () => {
		const keywords: Keywords[] = [
			{
				level: 1,
				keyword: [{ tag: "#text", value: "Science" }],
				children: [
					{
						level: 2,
						keyword: [{ tag: "#text", value: "Physics" }],
						children: [],
					},
				],
			},
		];

		const screen = await render(
			<TagCatalogProvider tagCatalog={tagCatalog}>
				<MulticatKeywords keywords={keywords} />
			</TagCatalogProvider>,
		);

		await expect.element(screen.getByRole("tree")).toBeInTheDocument();
		await expect
			.element(
				screen.getByRole("treeitem").filter({
					hasText: "1-Science",
				}),
			)
			.toBeInTheDocument();
		await expect
			.element(
				screen.getByRole("treeitem").filter({
					hasText: "2-Physics",
				}),
			)
			.toBeInTheDocument();
	});
});
