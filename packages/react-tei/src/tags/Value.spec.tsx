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

		expect(screen.getByText("Hello!")).toBeInTheDocument();
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

		expect(screen.getByText("Hello, world!")).toBeInTheDocument();
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

		expect(screen.getByRole("paragraph")).toHaveTextContent(
			"This is a nested value.",
		);
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
		expect(screen.container).toBeEmptyDOMElement();
	});
});
