import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { Hi } from "./Hi";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("Hi", () => {
	it("should render text", async () => {
		const jsonValue: DocumentJson = {
			tag: "hi",
			attributes: {},
			value: [
				{
					tag: "#text",
					attributes: {},
					value: "Hello",
				},
			],
		};

		const screen = await render(<Hi data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		await expect.element(screen.getByText("Hello")).toBeInTheDocument();
	});

	it.each([
		["italic", "em"],
		["bold", "strong"],
		["underline", "u"],
		["superscript", "sup"],
		["subscript", "sub"],
		["smallCaps", "span"],
	])("should render text with format %s", async (format: string, expectedTag: string) => {
		const jsonValue: DocumentJson = {
			tag: "hi",
			attributes: { "@rend": format },
			value: [
				{
					tag: "#text",
					attributes: {},
					value: "Formatted Text",
				},
			],
		};

		const screen = await render(<Hi data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		const element = screen.getByText("Formatted Text");
		expect(element).toBeInTheDocument();
		expect(element.element().tagName.toLowerCase()).toBe(expectedTag);
	});

	it("should render text with multiple formats", async () => {
		const jsonValue: DocumentJson = {
			tag: "hi",
			attributes: { "@rend": "bold italic" },
			value: [
				{
					tag: "#text",
					attributes: {},
					value: "Bold Italic Text",
				},
			],
		};

		const screen = await render(<Hi data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		const element = screen.getByText("Bold Italic Text");
		expect(element).toBeInTheDocument();
		expect(element.element().tagName.toLowerCase()).toBe("em");
		expect(element.element().parentElement?.tagName.toLowerCase()).toBe(
			"strong",
		);
	});
});
