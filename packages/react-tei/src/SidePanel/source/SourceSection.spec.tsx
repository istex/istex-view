import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { tagCatalog } from "../../tags/tagCatalog";
import { DocumentSidePanelContextProvider } from "../DocumentSidePanelContext";
import { SourceSection } from "./SourceSection";

export function createTeiDocument(monogr: DocumentJson[]): DocumentJson[] {
	return [
		{
			tag: "TEI",
			value: [
				{
					tag: "teiHeader",
					value: [
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
													tag: "monogr",
													value: monogr,
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

export function TestWrapper({
	children,
	monogr,
}: {
	children: React.ReactNode;
	monogr: DocumentJson[];
}) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={createTeiDocument(monogr)}>
				<DocumentSidePanelContextProvider>
					<TagCatalogProvider tagCatalog={tagCatalog}>
						{children}
					</TagCatalogProvider>
				</DocumentSidePanelContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("SourceSection", () => {
	const monogr = [
		{
			tag: "title",
			attributes: {
				"@type": "main",
				"@level": "m",
			},
			value: [
				{
					tag: "#text",
					value: "Main Title of the Document",
				},
			],
		},
		{
			tag: "title",
			attributes: {
				"@type": "sub",
				"@level": "m",
			},
			value: [
				{
					tag: "#text",
					value: "Subtitle of the Document",
				},
			],
		},
	];

	it("should render source section", async () => {
		const { getByRole, getByText } = await render(<SourceSection />, {
			wrapper: ({ children }) => (
				<TestWrapper monogr={monogr}>{children}</TestWrapper>
			),
		});

		expect(getByRole("button", { name: "Source" })).toBeInTheDocument();
		expect(getByRole("button", { name: "Source" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);
		expect(getByText("Main Title of the Document")).toBeVisible();
		expect(getByText("Subtitle of the Document")).toBeVisible();
		await getByRole("button", { name: "Source" }).click();
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(getByRole("button", { name: "Source" })).toHaveAttribute(
			"aria-expanded",
			"false",
		);
		expect(getByText("Main Title of the Document")).not.toBeVisible();
		expect(getByText("Subtitle of the Document")).not.toBeVisible();
	});

	it("should render source section with imprint tag", async () => {
		const monogr = [
			{
				tag: "title",
				attributes: {
					"@type": "main",
					"@level": "m",
				},
				value: [
					{
						tag: "#text",
						value: "Main Title of the Document",
					},
				],
			},
			{
				tag: "title",
				attributes: {
					"@type": "sub",
					"@level": "m",
				},
				value: [
					{
						tag: "#text",
						value: "Subtitle of the Document",
					},
				],
			},
			{
				tag: "imprint",
				value: [
					{
						tag: "biblScope",
						attributes: { "@unit": "vol" },
						value: [
							{
								tag: "#text",
								value: "10",
							},
						],
					},
					{
						tag: "biblScope",
						attributes: { "@unit": "issue" },
						value: [
							{
								tag: "#text",
								value: "2",
							},
						],
					},
					{
						tag: "biblScope",
						attributes: { "@unit": "page", "@from": "100" },
						value: [
							{
								tag: "#text",
								value: "100",
							},
						],
					},
					{
						tag: "biblScope",
						attributes: { "@unit": "page", "@to": "110" },
						value: [
							{
								tag: "#text",
								value: "110",
							},
						],
					},
					{
						tag: "date",
						attributes: { "@when": "2020" },
						value: [],
					},
				],
			},
		];

		const { getByText } = await render(<SourceSection />, {
			wrapper: ({ children }) => (
				<TestWrapper monogr={monogr}>{children}</TestWrapper>
			),
		});
		await expect
			.element(getByText("Vol. 10, n° 2 (2020), pp. 100-110"))
			.toBeInTheDocument();
	});

	it("should not render source section if no title is present", async () => {
		const jsonDocumentWithoutTitle = [
			{
				tag: "TEI",
				value: [],
			},
		];
		const { container } = await render(<SourceSection />, {
			wrapper: ({ children }) => (
				<I18nProvider>
					<DocumentContextProvider jsonDocument={jsonDocumentWithoutTitle}>
						<DocumentSidePanelContextProvider>
							<TagCatalogProvider tagCatalog={tagCatalog}>
								{children}
							</TagCatalogProvider>
						</DocumentSidePanelContextProvider>
					</DocumentContextProvider>
				</I18nProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});
});
