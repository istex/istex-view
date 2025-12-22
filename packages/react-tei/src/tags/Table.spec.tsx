import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { DocumentJson } from "../parser/document";
import { Table } from "./Table";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("Table", () => {
	it("should render a table with caption, header, rows, and notes", async () => {
		const jsonDocument: DocumentJson = {
			tag: "table",
			attributes: { "@xml:id": "t1" },
			value: [
				{ tag: "head", attributes: { "@type": "label" }, value: "Table 1" },
				{ tag: "head", attributes: {}, value: "Sample Table" },
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
					attributes: { "@role": "data" },
					value: [
						{ tag: "cell", attributes: {}, value: "Data 1" },
						{ tag: "cell", attributes: {}, value: "Data 2" },
					],
				},
				{
					tag: "note",
					attributes: {},
					value: [
						{
							tag: "note",
							attributes: {},
							value: [
								{ tag: "p", attributes: {}, value: "This is a table note." },
							],
						},
					],
				},
			],
		};

		const screen = await render(<Table data={jsonDocument} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(
			screen.getByRole("table", {
				name: "Table 1 Sample Table",
			}),
		).toBeVisible();

		expect(screen.getByRole("caption")).toBeVisible();
		expect(screen.getByRole("caption")).toHaveTextContent(
			"Table 1 Sample Table",
		);

		expect(
			screen.getByRole("columnheader", { name: "Header 1" }),
		).toBeVisible();
		expect(
			screen.getByRole("columnheader", { name: "Header 2" }),
		).toBeVisible();

		expect(screen.getByRole("cell", { name: "Data 1" })).toBeVisible();
		expect(screen.getByRole("cell", { name: "Data 2" })).toBeVisible();

		expect(screen.getByRole("paragraph")).toBeVisible();
		expect(screen.getByRole("paragraph")).toHaveTextContent(
			"This is a table note.",
		);
	});

	it("should render a table without caption and notes", async () => {
		const jsonDocument = {
			tag: "table",
			attributes: { "@xml:id": "t2" },
			value: [
				{
					tag: "row",
					attributes: { "@role": "label" },
					value: [
						{ tag: "cell", attributes: {}, value: "Header A" },
						{ tag: "cell", attributes: {}, value: "Header B" },
					],
				},
				{
					tag: "row",
					attributes: { "@role": "data" },
					value: [
						{ tag: "cell", attributes: {}, value: "Data A1" },
						{ tag: "cell", attributes: {}, value: "Data B1" },
					],
				},
			],
		};

		const screen = await render(<Table data={jsonDocument} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByRole("table")).toBeVisible();

		expect(screen.getByRole("caption")).not.toBeInTheDocument();

		expect(
			screen.getByRole("columnheader", { name: "Header A" }),
		).toBeVisible();
		expect(
			screen.getByRole("columnheader", { name: "Header B" }),
		).toBeVisible();

		expect(screen.getByRole("cell", { name: "Data A1" })).toBeVisible();
		expect(screen.getByRole("cell", { name: "Data B1" })).toBeVisible();

		expect(screen.getByRole("paragraph")).not.toBeInTheDocument();
	});
});
