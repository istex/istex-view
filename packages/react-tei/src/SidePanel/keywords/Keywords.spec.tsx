import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Keywords } from "./Keywords";
import { keywordTagCatalog } from "./keywordTagCatalog";

describe("Keywords", () => {
	it("should render keywords correctly", async () => {
		const data = {
			tag: "keywords",
			value: [
				{
					tag: "term",
					value: [
						{
							tag: "#text",
							value: "Keyword A",
						},
					],
				},
				{
					tag: "term",
					value: [
						{
							tag: "#text",
							value: "Keyword B",
						},
					],
				},
			],
		};

		const { getByText } = await render(<Keywords data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={keywordTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(getByText("Keyword A")).toBeInTheDocument();
		expect(getByText("Keyword A")).toBeInTheDocument();
	});

	it("should render nothing when keywords value is empty", async () => {
		const data = {
			tag: "keywords",
			value: [],
		};

		const { container } = await render(<Keywords data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={keywordTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});

	it("should render nothing when keywords value is a string", async () => {
		const data = {
			tag: "keywords",
			value: "A string",
		};

		const { container } = await render(<Keywords data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={keywordTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});

	it("should render nothing when keywords value contain only #text tag", async () => {
		const data = {
			tag: "keywords",
			value: [
				{
					tag: "#text",
					value: "Just some text",
				},
			],
		};

		const { container } = await render(<Keywords data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={keywordTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});
});
