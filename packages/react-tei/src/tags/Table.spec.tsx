import { afterAll, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import { I18nProvider } from "../i18n/I18nProvider";
import type { DocumentJson } from "../parser/document";
import { DocumentSidePanelContextProvider } from "../SidePanel/DocumentSidePanelContext";
import { Table } from "./Table";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={[]}>
				<DocumentSidePanelContextProvider>
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				</DocumentSidePanelContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}
vi.mock("../debug/debug.const", () => ({
	IS_DEBUG: true,
}));

describe("Table", () => {
	afterAll(() => {
		vi.resetAllMocks();
	});
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
					attributes: {
						"@type": "table-wrap-foot",
					},
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
			.element(screen.getByRole("columnheader", { name: "Header 1" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("columnheader", { name: "Header 2" }))
			.toBeVisible();

		await expect
			.element(screen.getByRole("cell", { name: "Data 1" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("cell", { name: "Data 2" }))
			.toBeVisible();

		await expect.element(screen.getByRole("note")).toBeVisible();
		await expect
			.element(screen.getByRole("note"))
			.toHaveTextContent("This is a table note.");
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
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("table")).toBeVisible();

		await expect
			.element(screen.getByRole("columnheader", { name: "Header A" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("columnheader", { name: "Header B" }))
			.toBeVisible();

		await expect
			.element(screen.getByRole("cell", { name: "Data A1" }))
			.toBeVisible();
		await expect
			.element(screen.getByRole("cell", { name: "Data B1" }))
			.toBeVisible();

		await expect.element(screen.getByRole("paragraph")).not.toBeInTheDocument();
	});

	it("should support fullscreen mode", async () => {
		const jsonDocument: DocumentJson = {
			tag: "table",
			attributes: { "@xml:id": "t3" },
			value: [
				{ tag: "head", attributes: { "@type": "label" }, value: "Table 3" },
				{
					tag: "row",
					attributes: { "@role": "label" },
					value: [
						{ tag: "cell", attributes: {}, value: "H1" },
						{ tag: "cell", attributes: {}, value: "H2" },
					],
				},
				{
					tag: "row",
					attributes: { "@role": "data" },
					value: [
						{ tag: "cell", attributes: {}, value: "D1" },
						{ tag: "cell", attributes: {}, value: "D2" },
					],
				},
			],
		};

		const screen = await render(<Table data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		const fullScreenButton = screen.getByRole("button", {
			name: "Passer en mode plein écran",
		});
		await expect.element(fullScreenButton).toBeVisible();

		await fullScreenButton.click();

		const dialog = screen.getByRole("dialog");
		await expect.element(dialog).toBeVisible();

		const exitFullScreenButton = screen.getByRole("button", {
			name: "Quitter le mode plein écran",
		});
		await expect.element(exitFullScreenButton).toBeVisible();

		await exitFullScreenButton.click();

		await expect.element(dialog).not.toBeInTheDocument();
	});

	it("should render debug when table is empty", async () => {
		const jsonDocument: DocumentJson = {
			tag: "table",
			attributes: { "@xml:id": "t4" },
			value: [],
		};

		const screen = await render(<Table data={jsonDocument} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});
});
