import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { Epigraph } from "./Epigraph";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("Epigraph", () => {
	it("should render Epigraph with text content", async () => {
		const jsonValue: DocumentJson = {
			tag: "epigraph",
			attributes: {},
			value: [{ tag: "#text", value: "This is an epigraph." }],
		};

		const screen = await render(<Epigraph data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByText("This is an epigraph.")).toBeVisible();
	});

	it("should render Epigraph with paragraph using caption variant", async () => {
		const jsonValue: DocumentJson = {
			tag: "epigraph",
			attributes: {},
			value: [
				{
					tag: "p",
					attributes: {},
					value: [{ tag: "#text", value: "A quote in a paragraph." }],
				},
			],
		};

		const screen = await render(<Epigraph data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByText("A quote in a paragraph.")).toBeVisible();
	});

	it("should render Epigraph with multiple paragraphs", async () => {
		const jsonValue: DocumentJson = {
			tag: "epigraph",
			attributes: {},
			value: [
				{
					tag: "p",
					attributes: {},
					value: [{ tag: "#text", value: "First paragraph." }],
				},
				{
					tag: "p",
					attributes: {},
					value: [{ tag: "#text", value: "Second paragraph." }],
				},
			],
		};

		const screen = await render(<Epigraph data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByText("First paragraph.")).toBeVisible();
		expect(screen.getByText("Second paragraph.")).toBeVisible();
	});
});
