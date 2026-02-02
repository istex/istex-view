import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import type { DocumentJson } from "../../parser/document";
import { DocumentSidePanelContextProvider } from "../DocumentSidePanelContext";
import { FootnotesSection } from "./FootnotesSection";

function wrapInDocument(documentJson: DocumentJson[]): DocumentJson[] {
	return [
		{
			tag: "TEI",
			value: [
				{
					tag: "text",
					value: [
						{
							tag: "back",
							value: documentJson,
						},
					],
				},
			],
		},
	];
}

export function TestWrapper({
	jsonDocument,
	children,
}: {
	jsonDocument: DocumentJson[];
	children: React.ReactNode;
}) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={jsonDocument}>
				<DocumentSidePanelContextProvider>
					<TestDocumentNavigationContextProvider>
						{children}
					</TestDocumentNavigationContextProvider>
				</DocumentSidePanelContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("FootnotesSection", () => {
	it("should render math tags correctly", async () => {
		const document = wrapInDocument([
			{
				tag: "div",
				attributes: { "@type": "fn-group" },
				value: [
					{
						tag: "note",
						value: [
							{
								tag: "p",
								value: [
									{
										tag: "formula",
										value: [
											{
												tag: "math",
												attributes: {
													xmlns: "http://www.w3.org/1998/Math/MathML",
												},
												value: [
													{
														tag: "mi",
														value: [
															{
																tag: "#text",
																value: "x",
															},
														],
													},
													{
														tag: "mo",
														value: [
															{
																tag: "#text",
																value: "=",
															},
														],
													},
													{
														tag: "mn",
														value: [
															{
																tag: "#text",
																value: "1",
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
				],
			},
		]);

		const screen = await render(<FootnotesSection />, {
			wrapper: ({ children }) => (
				<TestWrapper jsonDocument={document}>{children}</TestWrapper>
			),
		});

		const note = screen.getByRole("note");
		await expect.element(note).toBeInTheDocument();
		await expect.element(note.getByRole("figure")).toHaveTextContent("x=1");
	});
});
