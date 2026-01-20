import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { TableRow } from "./TableRow";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("TableRow", () => {
	it("should render a table row with cells", async () => {
		const jsonRow: DocumentJson = {
			tag: "row",
			attributes: {},
			value: [
				{
					tag: "cell",
					attributes: { "@rows": "2", "@cols": "1" },
					value: "Cell 1",
				},
				{
					tag: "cell",
					attributes: {},
					value: "Cell 2",
				},
			],
		};

		const screen = await render(<TableRow data={jsonRow} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.getByRole("cell", { name: "Cell 1" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("cell", { name: "Cell 2" }))
			.toBeVisible();
	});
});
