import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { Title } from "./Title";
import { tagCatalog } from "./tagCatalog";

describe("Title", () => {
	it("should render title inside a span with fontWeight bold when type is main", async () => {
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
		await expect.element(screen.getByText("Main Title")).toBeVisible();
		await expect.element(screen.container.querySelector("span")).toBeTruthy();
		await expect.element(screen.container.querySelector("span")).toHaveStyle({
			fontWeight: "bold",
		});
	});

	it("should render title inside a subtitle1 span when type is sub", async () => {
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
		await expect.element(screen.getByText("Subtitle")).toBeVisible();
		expect(
			screen.container.querySelector("span.MuiTypography-subtitle1"),
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
		await expect.element(screen.getByText("Plain Title")).toBeVisible();
		await expect.element(screen.container.querySelector("span")).toBeNull();
	});
});
