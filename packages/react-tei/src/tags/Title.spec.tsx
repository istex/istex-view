import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { Title } from "./Title";
import { tagCatalog } from "./tagCatalog";

describe("Title", () => {
	it("should render title inside a p with fontWeight bold when type is main", async () => {
		const screen = await render(
			<Title
				data={{
					tag: "title",
					attributes: { "@type": "main" },
					value: [{ tag: "#text", value: "Main Title" }],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);
		expect(screen.getByText("Main Title")).toBeVisible();
		expect(screen.container.querySelector("p")).toBeTruthy();
		expect(screen.container.querySelector("p")).toHaveStyle({
			fontWeight: "bold",
		});
	});

	it("should render title inside a subtitle1 Typography when type is sub", async () => {
		const screen = await render(
			<Title
				data={{
					tag: "title",
					attributes: { "@type": "sub" },
					value: [{ tag: "#text", value: "Subtitle" }],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);
		expect(screen.getByText("Subtitle")).toBeVisible();
		expect(
			screen.container.querySelector("h6.MuiTypography-subtitle1"),
		).toBeTruthy();
	});

	it("should render title as plain text when type is not specified", async () => {
		const screen = await render(
			<Title
				data={{
					tag: "title",
					attributes: {},
					value: [{ tag: "#text", value: "Plain Title" }],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);
		expect(screen.getByText("Plain Title")).toBeVisible();
		expect(screen.container.querySelector("p")).toBeNull();
		expect(
			screen.container.querySelector("h6.MuiTypography-subtitle1"),
		).toBeNull();
	});
});
