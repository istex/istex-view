import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import { I18nProvider } from "../i18n/I18nProvider";
import type { DocumentJson } from "../parser/document";
import { DocumentSidePanelContextProvider } from "../SidePanel/DocumentSidePanelContext";
import { TagCatalogProvider } from "../tags/TagCatalogProvider";
import { tagCatalog } from "../tags/tagCatalog";
import { Appendices } from "./Appendices";

function createTEIDocument(appendices: DocumentJson[]): DocumentJson[] {
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
							value: [],
						},
					],
				},
				{
					tag: "text",
					value: [
						{
							tag: "body",
							value: [],
						},
						{
							tag: "back",
							value: appendices,
						},
					],
				},
			],
		},
	];
}

function TestWrapper({
	children,
	appendices,
}: {
	children: React.ReactNode;
	appendices: DocumentJson[];
}) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				<DocumentContextProvider jsonDocument={createTEIDocument(appendices)}>
					<DocumentSidePanelContextProvider>
						{children}
					</DocumentSidePanelContextProvider>
				</DocumentContextProvider>
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("Appendices", () => {
	it("should renders appendices when present", async () => {
		const appendices = [
			{
				tag: "div",
				attributes: { "@type": "appendices" },
				value: [
					{
						tag: "div",
						attributes: { "@type": "figure" },
						value: [
							{
								tag: "figure",
								value: [
									{
										tag: "head",
										value: "Figure 1: Sample Figure",
									},
								],
							},
						],
					},
					{
						tag: "div",
						attributes: { "@type": "table" },
						value: [
							{
								tag: "table",
								value: [
									{
										tag: "head",
										value: "Table 1: Sample Table",
									},
								],
							},
						],
					},
				],
			},
		];
		const screen = await render(<Appendices />, {
			wrapper: ({ children }) => (
				<TestWrapper appendices={appendices}>{children}</TestWrapper>
			),
		});

		await expect
			.element(screen.getByText("Figure 1: Sample Figure"))
			.toBeInTheDocument();
		await expect
			.element(screen.getByText("Table 1: Sample Table"))
			.toBeInTheDocument();
	});

	it("should not render anything for empty authors array", async () => {
		const screen = await render(<Appendices />, {
			wrapper: ({ children }) => (
				<TestWrapper appendices={[]}>{children}</TestWrapper>
			),
		});
		await expect.element(screen.container).toBeEmptyDOMElement();
	});
});
