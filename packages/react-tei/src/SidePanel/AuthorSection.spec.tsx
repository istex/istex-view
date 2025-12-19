import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider.js";
import type { DocumentJson } from "../parser/document.js";
import { AuthorSection } from "./AuthorSection.js";

const jsonDocument: DocumentJson[] = [
	{
		tag: "?xml",
		value: [
			{
				tag: "#text",
				value: "",
			},
		],
		attributes: {
			"@version": "1.0",
			"@encoding": "UTF-8",
		},
	},
	{
		tag: "TEI",
		value: [
			{
				tag: "#text",
				value: "\n    ",
			},
			{
				tag: "teiHeader",
				value: [
					{
						tag: "#text",
						value: "\n        ",
					},
					{
						tag: "fileDesc",
						value: [
							{
								tag: "#text",
								value: "\n            ",
							},
							{
								tag: "titleStmt",
								value: [
									{
										tag: "#text",
										value: "\n                ",
									},
									{
										tag: "title",
										value: [
											{
												tag: "#text",
												value: "Sample ",
											},
											{
												tag: "hi",
												value: [
													{
														tag: "#text",
														value: "TEI",
													},
												],
												attributes: {
													"@rend": "italic",
												},
											},
											{
												tag: "#text",
												value: " File",
											},
										],
										attributes: {
											"@level": "a",
											"@type": "main",
										},
									},
									{
										tag: "#text",
										value: "\n            ",
									},
								],
							},
							{
								tag: "#text",
								value: "\n            ",
							},
							{
								tag: "sourceDesc",
								value: [
									{
										tag: "#text",
										value: "\n                ",
									},
									{
										tag: "biblStruct",
										value: [
											{
												tag: "#text",
												value: "\n                    ",
											},
											{
												tag: "analytic",
												value: [
													{
														tag: "#text",
														value: "\n                        ",
													},
													{
														tag: "title",
														value: [
															{
																tag: "#text",
																value: "Sample ",
															},
															{
																tag: "hi",
																value: [
																	{
																		tag: "#text",
																		value: "TEI",
																	},
																],
																attributes: {
																	"@rend": "italic",
																},
															},
															{
																tag: "#text",
																value: " File",
															},
														],
														attributes: {
															"@level": "a",
															"@type": "main",
														},
													},
													{
														tag: "#text",
														value: "\n                        ",
													},
													{
														tag: "author",
														value: [
															{
																tag: "#text",
																value: "\n                            ",
															},
															{
																tag: "persName",
																value: [
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "roleName",
																		value: [
																			{
																				tag: "#text",
																				value: "Mr",
																			},
																		],
																		attributes: {
																			"@type": "honorific",
																		},
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "forename",
																		value: [
																			{
																				tag: "#text",
																				value: "Victor",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "surname",
																		value: [
																			{
																				tag: "#text",
																				value: "Hugo",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                            ",
																	},
																],
															},
															{
																tag: "#text",
																value: "\n                        ",
															},
														],
													},
													{
														tag: "#text",
														value: "\n                        ",
													},
													{
														tag: "author",
														value: [
															{
																tag: "#text",
																value: "\n                            ",
															},
															{
																tag: "persName",
																value: [
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "forename",
																		value: [
																			{
																				tag: "#text",
																				value: "Jean",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "surname",
																		value: [
																			{
																				tag: "#text",
																				value: "Paul",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "genName",
																		value: [
																			{
																				tag: "#text",
																				value: "II",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                            ",
																	},
																],
															},
															{
																tag: "#text",
																value: "\n                        ",
															},
														],
													},
													{
														tag: "#text",
														value: "\n                        ",
													},
													{
														tag: "author",
														value: [
															{
																tag: "#text",
																value: "\n                            ",
															},
															{
																tag: "persName",
																value: [
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "forename",
																		value: [
																			{
																				tag: "#text",
																				value: "Jean",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "nameLink",
																		value: [
																			{
																				tag: "#text",
																				value: "De",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "surname",
																		value: [
																			{
																				tag: "#text",
																				value: "La Fontaine",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                            ",
																	},
																],
															},
															{
																tag: "#text",
																value: "\n                        ",
															},
														],
													},
													{
														tag: "#text",
														value: "\n                        ",
													},
													{
														tag: "author",
														value: [
															{
																tag: "#text",
																value: "\n                            ",
															},
															{
																tag: "persName",
																value: [
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "roleName",
																		value: [
																			{
																				tag: "#text",
																				value: "Dr",
																			},
																		],
																		attributes: {
																			"@type": "honorific",
																		},
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "forename",
																		value: [
																			{
																				tag: "#text",
																				value: "Marie",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "surname",
																		value: [
																			{
																				tag: "#text",
																				value: "Curie",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "roleName",
																		value: [
																			{
																				tag: "#text",
																				value: "PhD",
																			},
																		],
																		attributes: {
																			"@type": "degree",
																		},
																	},
																	{
																		tag: "#text",
																		value: "\n                            ",
																	},
																],
															},
															{
																tag: "#text",
																value: "\n                        ",
															},
														],
													},
													{
														tag: "#text",
														value: "\n                        ",
													},
													{
														tag: "author",
														value: [
															{
																tag: "#text",
																value: "\n                            ",
															},
															{
																tag: "persName",
																value: [
																	{
																		tag: "#text",
																		value: "\n                                ",
																	},
																	{
																		tag: "orgName",
																		value: [
																			{
																				tag: "#text",
																				value: "Dead Poets Society",
																			},
																		],
																	},
																	{
																		tag: "#text",
																		value: "\n                            ",
																	},
																],
															},
															{
																tag: "#text",
																value: "\n                        ",
															},
														],
													},
													{
														tag: "#text",
														value: "\n                    ",
													},
													{
														tag: "author",
														value: [
															{
																tag: "name",
																value: [{ tag: "#text", value: "Anonymous" }],
															},
														],
													},
												],
											},
											{
												tag: "#text",
												value: "\n                ",
											},
										],
									},
									{
										tag: "#text",
										value: "\n            ",
									},
								],
							},
							{
								tag: "#text",
								value: "\n        ",
							},
						],
					},
					{
						tag: "#text",
						value: "\n    ",
					},
				],
			},
			{
				tag: "#text",
				value: "\n    ",
			},
			{
				tag: "text",
				value: [],
			},
			{
				tag: "#text",
				value: "\n",
			},
		],
		attributes: {
			"@xmlns:ns1": "https://xml-schema.delivery.istex.fr/formats/ns1.xsd",
			"@xmlns": "http://www.tei-c.org/ns/1.0",
			"@xmlns:tei": "http://www.tei-c.org/ns/1.0",
			"@xmlns:sa": "http://www.elsevier.com/xml/common/struct-aff/dtd",
			"@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
			"@xsi:noNamespaceSchemaLocation":
				"https://xml-schema.delivery.istex.fr/formats/tei-istex.xsd",
			"@xml:lang": "en",
		},
	},
];

describe("AuthorSection", () => {
	it("should render An accordion listing all authors of documents", async () => {
		const { getByText, getByRole, getByLabelText } = await render(
			<AuthorSection />,
			{
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={jsonDocument}>
						{children}
					</DocumentContextProvider>
				),
			},
		);

		expect(
			getByRole("button", { name: "sidePanel.authors" }),
		).toBeInTheDocument();

		expect(getByRole("button", { name: "sidePanel.authors" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);

		expect(getByLabelText("sidePanel.author.label")).toHaveLength(6);
		expect(getByLabelText("sidePanel.author.label").nth(0)).toHaveTextContent(
			"Mr Victor Hugo",
		);
		expect(getByLabelText("sidePanel.author.label").nth(1)).toHaveTextContent(
			"Jean Paul II",
		);
		expect(getByLabelText("sidePanel.author.label").nth(2)).toHaveTextContent(
			"Jean De La Fontaine",
		);
		expect(getByLabelText("sidePanel.author.label").nth(3)).toHaveTextContent(
			"Dr Marie Curie PhD",
		);
		expect(getByLabelText("sidePanel.author.label").nth(4)).toHaveTextContent(
			"Dead Poets Society",
		);
		expect(getByLabelText("sidePanel.author.label").nth(5)).toHaveTextContent(
			"Anonymous",
		);

		expect(getByText("Mr", { exact: true })).toHaveAttribute(
			"aria-description",
			"sidePanel.author.honorific",
		);
		expect(getByText("Dr", { exact: true })).toHaveAttribute(
			"aria-description",
			"sidePanel.author.honorific",
		);
		expect(getByText("PhD", { exact: true })).toHaveAttribute(
			"aria-description",
			"sidePanel.author.degree",
		);
		expect(getByText("II", { exact: true })).toHaveAttribute(
			"aria-description",
			"sidePanel.author.genName",
		);
		expect(getByText("De", { exact: true })).toHaveAttribute(
			"aria-description",
			"sidePanel.author.nameLink",
		);
		expect(getByText("Dead Poets Society", { exact: true })).toHaveAttribute(
			"aria-description",
			"sidePanel.author.orgName",
		);
	});

	it("should render nothing if there is no author in document", async () => {
		const { container } = await render(<AuthorSection />, {
			wrapper: ({ children }) => (
				<DocumentContextProvider jsonDocument={[]}>
					{children}
				</DocumentContextProvider>
			),
		});

		expect(container).toBeEmptyDOMElement();
	});
});
