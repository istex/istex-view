import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { authorTagCatalogs } from "./authorsTagCatalog";
import { getDescriptionKey, PersNamePart } from "./PersNamePart";

describe("PersNamePart", () => {
	describe("getDescriptionKey", () => {
		it.each([
			[
				{
					tag: "forename",
					value: [],
				},
				"forename",
			],
			[
				{
					tag: "roleName",
					attributes: { "@type": "honorific" },
					value: [],
				},
				"honorific",
			],
			[
				{
					tag: "roleName",
					attributes: { "@type": "degree" },
					value: [],
				},
				"degree",
			],
			[
				{
					tag: "roleName",
					attributes: { "@type": "unknown" },
					value: [],
				},
				null,
			],
			[
				{
					tag: "roleName",
					attributes: {},
					value: [],
				},
				null,
			],
			[
				{
					tag: "surname",
					value: [],
				},
				"surname",
			],
			[
				{
					tag: "genName",
					value: [],
				},
				"genName",
			],
			[
				{
					tag: "nameLink",
					value: [],
				},
				"nameLink",
			],
			[
				{
					tag: "addName",
					value: [],
				},
				"addName",
			],
			[
				{
					tag: "orgName",
					value: [],
				},
				"orgName",
			],
			[
				{
					tag: "unknownTag",
					value: [],
				},
				null,
			],
		])("should return description type", (input: DocumentJson, expected:
			| string
			| null) => {
			const descriptionKey = getDescriptionKey(input);

			expect(descriptionKey).toBe(expected);
		});
	});

	it("should render PersNamePart value with aria-description", async () => {
		const { getByText } = await render(
			<PersNamePart
				data={{
					tag: "forename",
					value: [{ tag: "#text", value: "John" }],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={authorTagCatalogs}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		const spanElement = getByText("John");
		expect(spanElement).toBeInTheDocument();
		expect(spanElement).toHaveAttribute(
			"aria-description",
			"sidePanel.author.forename",
		);
	});

	it("should render PersNamePart value without aria-description for unknown description type", async () => {
		const { getByText } = await render(
			<PersNamePart
				data={{
					tag: "roleName",
					attributes: { "@type": "unknown" },
					value: [{ tag: "#text", value: "Unknown Role" }],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={authorTagCatalogs}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		const spanElement = getByText("Unknown Role");
		expect(spanElement).toBeInTheDocument();
		expect(spanElement).not.toHaveAttribute("aria-description");
	});

	it("should render nothing if data.value is not an array", async () => {
		const { container } = await render(
			<PersNamePart
				data={{
					tag: "forename",
					value: "Not an array" as unknown as DocumentJson[],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={authorTagCatalogs}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("should render nothing if data.value is an empty array", async () => {
		const { container } = await render(
			<PersNamePart
				data={{
					tag: "forename",
					value: [],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={authorTagCatalogs}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		expect(container).toBeEmptyDOMElement();
	});
});
