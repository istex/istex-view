import { afterAll, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Email } from "./Email";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

vi.mock("../debug/debug.const", () => ({
	IS_DEBUG: true,
}));
describe("Email", () => {
	afterAll(() => {
		vi.resetAllMocks();
	});
	it("should render an email link", async () => {
		const screen = await render(
			<Email
				data={{
					tag: "email",
					value: [
						{
							tag: "#text",
							value: "test@example.com",
						},
					],
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

		const link = screen.getByRole("link", { name: "test@example.com" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "mailto:test@example.com");
	});

	it("should trim whitespace from email", async () => {
		const screen = await render(
			<Email
				data={{
					tag: "email",
					value: [
						{
							tag: "#text",
							value: "  test@example.com  ",
						},
					],
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

		const link = screen.getByRole("link", { name: "test@example.com" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "mailto:test@example.com");
	});

	it("should render debug tag when no email value is found", async () => {
		const screen = await render(
			<Email
				data={{
					tag: "email",
					value: [],
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
		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});

	it("should render debug tag when #text tag is missing", async () => {
		const screen = await render(
			<Email
				data={{
					tag: "email",
					value: [
						{
							tag: "other",
							value: "test@example.com",
						},
					],
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

		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});

	it("should render debug tag when value is not a string", async () => {
		const screen = await render(
			<Email
				data={{
					tag: "email",
					value: [
						{
							tag: "#text",
							value: [],
						},
					],
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

		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});
});
