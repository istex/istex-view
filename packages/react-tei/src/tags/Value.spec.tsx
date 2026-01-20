import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";
import { Value } from "./Value";

describe("Value", () => {
	it("should render text nodes correctly", async () => {
		const jsonValue: DocumentJson = { tag: "#text", value: "Hello!" };

		const screen = await render(<Value data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.getByText("Hello!")).toBeInTheDocument();
	});

	it("should render an array of nodes correctly", async () => {
		const jsonValue: DocumentJson[] = [
			{ tag: "#text", value: "Hello, " },
			{
				tag: "hi",
				attributes: { rend: "bold" },
				value: [{ tag: "#text", value: "world" }],
			},
			{ tag: "#text", value: "!" },
		];

		const screen = await render(<Value data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.getByText("Hello, world!")).toBeInTheDocument();
	});

	it("should render nested tags correctly", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a " },
				{
					tag: "hi",
					attributes: { rend: "italic" },
					value: [{ tag: "#text", value: "nested" }],
				},
				{ tag: "#text", value: " value." },
			],
		};

		const screen = await render(<Value data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.getByRole("paragraph"))
			.toHaveTextContent("This is a nested value.");
	});

	it("should not render unsupported tags when DEBUG is disabled", async () => {
		const jsonValue: DocumentJson = {
			tag: "unsupportedTag",
			attributes: {},
			value: [{ tag: "#text", value: "This should not be rendered." }],
		};

		const screen = await render(<Value data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		await expect.element(screen.container).toBeEmptyDOMElement();
	});
});

describe("MathML", () => {
	it.each<DocumentJson["attributes"]>([
		{
			"@xmlns": "http://www.w3.org/1998/Math/MathML",
		},
		{},
	])("should render MathML tags without prefix", async (attributes) => {
		const jsonValue: DocumentJson = {
			tag: "math",
			attributes,
			value: [
				{
					tag: "mi",
					attributes: {},
					value: [{ tag: "#text", value: "x" }],
				},
				{
					tag: "mo",
					attributes: {},
					value: [{ tag: "#text", value: "+" }],
				},
				{
					tag: "mi",
					attributes: {},
					value: [{ tag: "#text", value: "y" }],
				},
			],
		};

		const screen = await render(<Value data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.getByRole("math")).toHaveTextContent("x+y");
	});

	it.each<string>([
		"m",
		"mml",
	])("should render MathML tags with '%s' namespace prefix and xmlns attribute", async (prefix) => {
		const jsonValue: DocumentJson = {
			tag: `${prefix}:math`,
			attributes: {
				[`@xmlns:${prefix}`]: "http://www.w3.org/1998/Math/MathML",
			},
			value: [
				{
					tag: `${prefix}:mi`,
					attributes: {},
					value: [{ tag: "#text", value: "a" }],
				},
				{
					tag: `${prefix}:mo`,
					attributes: {},
					value: [{ tag: "#text", value: "=" }],
				},
				{
					tag: `${prefix}:mi`,
					attributes: {},
					value: [{ tag: "#text", value: "b" }],
				},
			],
		};

		const screen = await render(<Value data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.getByRole("math")).toHaveTextContent("a=b");
	});

	it.each<string>([
		"m",
		"mml",
	])("should render MathML tags without xmlns", async (prefix) => {
		const jsonValue: DocumentJson = {
			tag: `${prefix}:math`,
			attributes: {},
			value: [
				{
					tag: `${prefix}:mi`,
					attributes: {},
					value: [{ tag: "#text", value: "p" }],
				},
				{
					tag: `${prefix}:mo`,
					attributes: {},
					value: [{ tag: "#text", value: ">" }],
				},
				{
					tag: `${prefix}:mi`,
					attributes: {},
					value: [{ tag: "#text", value: "q" }],
				},
			],
		};

		const screen = await render(<Value data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.getByRole("math")).toHaveTextContent("p>q");
	});
});
