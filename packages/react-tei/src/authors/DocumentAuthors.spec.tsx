import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import { I18nProvider } from "../i18n/I18nProvider";
import type { DocumentJson } from "../parser/document";
import { TagCatalogProvider } from "../tags/TagCatalogProvider";
import { authorTagCatalogs } from "./authorsTagCatalog";
import { DocumentAuthors } from "./DocumentAuthors";

function createTEIDocument(authors: DocumentJson[]): DocumentJson[] {
	return [
		{
			tag: "TEI",
			value: [
				{
					tag: "teiHeader",
					value: [
						{
							tag: "encodingDesc",
							value: [
								{
									tag: "projectDesc",
									value: [
										{
											tag: "p",
											value: "Some encoding description",
										},
									],
								},
							],
						},
						{
							tag: "fileDesc",
							value: [
								{
									tag: "sourceDesc",
									value: [
										{
											tag: "biblStruct",
											value: [
												{
													tag: "analytic",
													value: authors,
												},
											],
										},
									],
								},
							],
						},
					],
				},
			],
		},
	];
}

function TestWrapper({
	children,
	authors,
}: {
	children: React.ReactNode;
	authors: DocumentJson[];
}) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={authorTagCatalogs}>
				<DocumentContextProvider jsonDocument={createTEIDocument(authors)}>
					{children}
				</DocumentContextProvider>
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("DocumentAuthors", () => {
	it("should renders authors with affiliation if present", async () => {
		const authors = [
			{
				tag: "author",
				value: [
					{
						tag: "forename",
						value: [
							{
								tag: "#text",
								value: "John",
							},
						],
					},
					{
						tag: "#text",
						value: " ",
					},
					{
						tag: "surname",
						value: [
							{
								tag: "#text",
								value: "Doe",
							},
						],
					},
				],
			},
			{
				tag: "author",
				value: [
					{
						tag: "forename",
						value: [
							{
								tag: "#text",
								value: "Jane",
							},
						],
					},
					{
						tag: "#text",
						value: " ",
					},
					{
						tag: "surname",
						value: [
							{
								tag: "#text",
								value: "Smith",
							},
						],
					},
					{
						tag: "affiliation",
						value: [
							{
								tag: "orgName",
								value: [
									{
										tag: "#text",
										value: "University X",
									},
								],
							},
							{
								tag: "address",
								value: [
									{
										tag: "addrLine",
										value: [
											{
												tag: "#text",
												value: "123 Main St, Cityville",
											},
										],
									},
								],
							},
						],
					},
				],
			},
		];
		const screen = await render(<DocumentAuthors />, {
			wrapper: ({ children }) => (
				<TestWrapper authors={authors}>{children}</TestWrapper>
			),
		});

		await expect.element(screen.getByRole("list")).not.toBeInTheDocument();
		await screen.getByRole("button", { name: "Auteurs" }).click();

		await expect
			.element(screen.getByRole("listitem", { name: "Auteur" }))
			.toHaveLength(2);

		await expect.element(screen.getByText("John Doe")).toBeInTheDocument();
		await expect.element(screen.getByText("Jane Smith")).toBeInTheDocument();

		await expect
			.element(
				screen.getByRole("listitem", {
					name: "University X, 123 Main St, Cityville",
				}),
			)
			.toBeInTheDocument();
	});

	it("should not render anything for empty authors array", async () => {
		const screen = await render(<DocumentAuthors />, {
			wrapper: ({ children }) => (
				<TestWrapper authors={[]}>{children}</TestWrapper>
			),
		});
		await expect.element(screen.container).toBeEmptyDOMElement();
	});
});
