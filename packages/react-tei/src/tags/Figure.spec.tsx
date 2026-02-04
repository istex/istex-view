import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import type { DocumentJson } from "../parser/document";
import { DocumentSidePanelContextProvider } from "../SidePanel/DocumentSidePanelContext";
import { Figure } from "./Figure";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

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
			wrapper: TestWrapper,
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
	it("should render unloaded figure for non-table types", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: { "@type": "image", "@xml:id": "f1" },
			value: [],
		};

		const screen = await render(<Figure data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		expect(screen.getByText("figure.unloaded")).toBeVisible();
	});

	it("should render figure.unloaded along figure head and figDesc when they are presents", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: { "@type": "image", "@xml:id": "f2" },
			value: [
				{
					tag: "head",
					attributes: {},
					value: "This is the figure head",
				},
				{
					tag: "figDesc",
					attributes: {},
					value: "This is the figure description",
				},
			],
		};

		const screen = await render(<Figure data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		expect(screen.getByText("figure.unloaded")).toBeVisible();
		expect(screen.getByText("This is the figure head")).toBeVisible();
		expect(screen.getByText("This is the figure description")).toBeVisible();
	});
});
