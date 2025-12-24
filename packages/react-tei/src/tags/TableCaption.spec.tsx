import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { TableCaption } from "./TableCaption";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("TableCaption", () => {
	it("should render caption with label and title", async () => {
		const screen = await render(
			<TableCaption
				id="caption1"
				label={{ tag: "head", attributes: {}, value: "Table 1" }}
				titles={[{ tag: "head", attributes: {}, value: "Sample Table" }]}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Table 1 Sample Table");
	});

	it("should render caption with only title", async () => {
		const screen = await render(
			<TableCaption
				id="caption2"
				titles={[{ tag: "head", attributes: {}, value: "Only Title" }]}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Only Title");
	});

	it("should render caption with title as array", async () => {
		const screen = await render(
			<TableCaption
				id="caption5"
				titles={[
					{ tag: "head", attributes: {}, value: "Title Part 1" },
					{ tag: "head", attributes: {}, value: "Title Part 2" },
				]}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Title Part 1Title Part 2");
	});

	it("should render caption with only label", async () => {
		const screen = await render(
			<TableCaption
				id="caption3"
				label={{ tag: "head", attributes: {}, value: "Only Label" }}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Only Label");
	});

	it("should not render caption when neither label nor title is provided", async () => {
		const screen = await render(<TableCaption id="caption4" />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByRole("caption")).not.toBeInTheDocument();
	});
});
