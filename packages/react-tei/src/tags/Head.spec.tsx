import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document.js";
import { Head } from "./Head.js";
import { TagCatalogProvider } from "./TagCatalogProvider.js";
import { tagCatalog } from "./tagCatalog.js";

describe("Head", () => {
	it.each([
		{
			attributes: { id: "az", level: "2" },
			content: "Heading 1",
			expectedDepth: 2,
		},
		{ attributes: { id: "az", level: "2" }, content: "Heading 2" },
		{ attributes: { id: "az", level: "3" }, content: "Heading 3" },
		{ attributes: { id: "az", level: "4" }, content: "Heading 4" },
		{ attributes: { id: "az", level: "5" }, content: "Heading 5" },
		{ attributes: { id: "az", level: "6" }, content: "Heading 6" },
		{
			attributes: { id: "az", level: "7" },
			content: "Heading 7",
			expectedDepth: 6,
		},
	])("should render head tag ", async ({
		attributes,
		content,
		expectedDepth,
	}) => {
		const jsonValue: DocumentJson = {
			tag: "head",
			attributes,
			value: [{ tag: "#text", value: content }],
		};

		const screen = await render(<Head data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const heading = screen.getByRole("heading", {
			level: expectedDepth ?? parseInt(attributes.level, 10),
			name: content,
		});

		expect(heading).toBeInTheDocument();
		expect(heading).toHaveAttribute("id", attributes.id);
	});

	it("should render head tag with nested <hi> elements", async () => {
		const jsonValue: DocumentJson = {
			tag: "head",
			attributes: {
				id: "az",
				level: "2",
			},
			value: [
				{ tag: "#text", value: "This is a " },
				{
					tag: "hi",
					attributes: { rend: "italic" },
					value: [{ tag: "#text", value: "nested" }],
				},
				{ tag: "#text", value: " heading." },
			],
		};

		const screen = await render(<Head data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const heading = screen.getByRole("heading", { level: 2 });
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent("This is a nested heading.");
	});

	it.each([
		{ value: [] },
		{ value: undefined },
		{ value: "" },
	])("should not render when value is empty", async ({ value }) => {
		const jsonValue: DocumentJson = {
			tag: "head",
			attributes: {
				id: "az",
				level: "2",
			},
			value,
		};

		const screen = await render(<Head data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		expect(screen.container).toBeEmptyDOMElement();
	});
});
