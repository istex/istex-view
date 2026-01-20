import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { Figure } from "./Figure";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("Figure", () => {
	it("should render a table with caption, header, rows, and notes", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: { "@type": "table", "@xml:id": "t1" },
			value: [
				{
					tag: "table",
					attributes: {},
					value: [
						{
							tag: "row",
							attributes: { "@role": "label" },
							value: [
								{ tag: "cell", attributes: {}, value: "Header 1" },
								{ tag: "cell", attributes: {}, value: "Header 2" },
							],
						},
						{
							tag: "row",
							attributes: {},
							value: [
								{ tag: "cell", attributes: {}, value: "Data 1" },
								{ tag: "cell", attributes: {}, value: "Data 2" },
							],
						},
					],
				},
			],
		};

		const screen = await render(<Figure data={jsonDocument} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByRole("table")).toBeVisible();

		expect(
			screen.getByRole("columnheader", { name: "Header 1" }),
		).toBeVisible();
		expect(
			screen.getByRole("columnheader", { name: "Header 2" }),
		).toBeVisible();

		expect(screen.getByRole("cell", { name: "Data 1" })).toBeVisible();
		expect(screen.getByRole("cell", { name: "Data 2" })).toBeVisible();
	});
});
