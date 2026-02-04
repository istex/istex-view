import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import type { DocumentJson } from "../../parser/document";
import { DocumentSidePanelContextProvider } from "../../SidePanel/DocumentSidePanelContext";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FigureTable } from "./FigureTable";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<DocumentContextProvider jsonDocument={[]}>
			<DocumentSidePanelContextProvider>
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			</DocumentSidePanelContextProvider>
		</DocumentContextProvider>
	);
}

describe("FigureTable", () => {
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
							attributes: {},
							value: [
								{ tag: "cell", attributes: {}, value: "Data 1" },
								{ tag: "cell", attributes: {}, value: "Data 2" },
							],
						},
						{
							tag: "note",
							attributes: {
								"@type": "table-wrap-foot",
							},
							value: [
								{
									tag: "note",
									attributes: {},
									value: [
										{
											tag: "p",
											attributes: {},
											value: "This is a table note.",
										},
									],
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(<FigureTable data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("table")).toBeVisible();

		await expect
			.element(screen.getByRole("cell", { name: "Data 1" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("cell", { name: "Data 2" }))
			.toBeVisible();
	});

	it("should render a table with head ", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: { "@type": "table", "@xml:id": "t2" },
			value: [
				{ tag: "head", attributes: { "@type": "label" }, value: "Table 1" },
				{ tag: "head", attributes: {}, value: "Sample Table" },
				{
					tag: "table",
					attributes: {},
					value: [
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

		const screen = await render(<FigureTable data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(
				screen.getByRole("table", {
					name: "Table 1 Sample Table",
				}),
			)
			.toBeVisible();

		await expect.element(screen.getByRole("caption")).toBeVisible();
		await expect
			.element(screen.getByRole("caption"))
			.toHaveTextContent("Table 1 Sample Table");

		await expect
			.element(screen.getByRole("cell", { name: "Data 1" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("cell", { name: "Data 2" }))
			.toBeVisible();
	});
});
