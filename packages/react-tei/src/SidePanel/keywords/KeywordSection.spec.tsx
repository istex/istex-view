import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { DocumentSidePanelContextProvider } from "../DocumentSidePanelContext";
import { KeywordSection } from "./KeywordSection";

describe("KeywordSection", () => {
	it("should render list of keywords taken from the document", async () => {
		const jsonDocument = [
			{
				tag: "?xml",
				attributes: { version: "1.0", encoding: "UTF-8" },
				value: [],
			},
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [
															{
																tag: "#text",
																value: "Keyword 1",
															},
														],
													},
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword 2" }],
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{
						tag: "text",
						value: [],
					},
				],
			},
		];
		const { getByRole } = await render(<KeywordSection />, {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				</DocumentSidePanelContextProvider>
			),
		});

		expect(
			getByRole("button", { name: "sidePanel.keyword.title" }),
		).toBeInTheDocument();
		expect(getByRole("button", { name: "sidePanel.keyword" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);

		expect(getByRole("list")).toBeInTheDocument();
		expect(getByRole("listitem")).toHaveLength(2);
		expect(getByRole("listitem").nth(0)).toHaveTextContent("Keyword 1");
		expect(getByRole("listitem").nth(1)).toHaveTextContent("Keyword 2");
	});

	it("should render list of keyword ignoring head, list and item tags", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "keywords",
												value: [
													{
														tag: "head",
														value: [{ tag: "#text", value: "Keywords" }],
													},
													{
														tag: "list",
														value: [
															{
																tag: "item",
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
																],
															},
															{
																tag: "item",
																value: [
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
					{
						tag: "text",
						value: [],
					},
				],
			},
		];
		const { getByRole } = await render(<KeywordSection />, {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				</DocumentSidePanelContextProvider>
			),
		});

		expect(
			getByRole("button", { name: "sidePanel.keyword.title" }),
		).toBeInTheDocument();
		expect(getByRole("button", { name: "sidePanel.keyword" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);

		expect(getByRole("list")).toBeInTheDocument();
		expect(getByRole("listitem")).toHaveLength(2);
		expect(getByRole("listitem").nth(0)).toHaveTextContent("Keyword A");
		expect(getByRole("listitem").nth(1)).toHaveTextContent("Keyword B");
	});

	it('should ignore #text tag outside of "term" tags', async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "#text",
												value: "Some extraneous text",
											},
											{
												tag: "keywords",
												value: [
													{ tag: "#text", value: "Some extraneous text" },
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Z" }],
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{
						tag: "text",
						value: [],
					},
				],
			},
		];
		const { getByText } = await render(<KeywordSection />, {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				</DocumentSidePanelContextProvider>
			),
		});

		expect(getByText("Some extraneous text")).not.toBeInTheDocument();
	});

	it("should render several list in keywords section if there are several keywords tags", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword X1" }],
													},
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword X2" }],
													},
												],
											},
											{
												tag: "keywords",
												value: [
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Y1" }],
													},
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Y2" }],
													},
													{
														tag: "term",
														value: [{ tag: "#text", value: "Keyword Y3" }],
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{
						tag: "text",
						value: [],
					},
				],
			},
		];
		const { getByRole } = await render(<KeywordSection />, {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				</DocumentSidePanelContextProvider>
			),
		});

		expect(
			getByRole("button", { name: "sidePanel.keyword.title" }),
		).toBeInTheDocument();
		expect(getByRole("button", { name: "sidePanel.keyword" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);

		expect(getByRole("list")).toHaveLength(2);
		expect(getByRole("list").nth(0)).toBeInTheDocument();
		expect(getByRole("list").nth(0).getByRole("listitem")).toHaveLength(2);
		expect(
			getByRole("list").nth(0).getByRole("listitem").nth(0),
		).toHaveTextContent("Keyword X1");
		expect(
			getByRole("list").nth(0).getByRole("listitem").nth(1),
		).toHaveTextContent("Keyword X2");
		expect(getByRole("list").nth(1)).toBeInTheDocument();

		expect(getByRole("list").nth(1).getByRole("listitem")).toHaveLength(3);
		expect(
			getByRole("list").nth(1).getByRole("listitem").nth(0),
		).toHaveTextContent("Keyword Y1");
		expect(
			getByRole("list").nth(1).getByRole("listitem").nth(1),
		).toHaveTextContent("Keyword Y2");
		expect(
			getByRole("list").nth(1).getByRole("listitem").nth(2),
		).toHaveTextContent("Keyword Y3");
	});

	it("should render nothing if there is no keyword in the document", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [],
					},
					{
						tag: "text",
						value: [],
					},
				],
			},
		];
		const { container } = await render(<KeywordSection />, {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				</DocumentSidePanelContextProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});

	it("should render nothing if keywords tags have no term children", async () => {
		const jsonDocument = [
			{
				tag: "TEI",
				value: [
					{
						tag: "teiHeader",
						value: [
							{
								tag: "profileDesc",
								value: [
									{
										tag: "textClass",
										value: [
											{
												tag: "keywords",
												value: [
													{
														tag: "head",
														value: [{ tag: "#text", value: "Keywords" }],
													},
												],
											},
										],
									},
								],
							},
						],
					},
					{
						tag: "text",
						value: [],
					},
				],
			},
		];
		const { container } = await render(<KeywordSection />, {
			wrapper: ({ children }) => (
				<DocumentSidePanelContextProvider>
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				</DocumentSidePanelContextProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});
});
