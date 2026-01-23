import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FormulaRend } from "./FormulaRend";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TagCatalogProvider tagCatalog={tagCatalog}>{children}</TagCatalogProvider>
	);
}

describe("FormulaRend", () => {
	it("should render the inline formula", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@rend": "inline",
			},
			value: [
				{
					tag: "#text",
					value: "E = ",
				},
				{
					tag: "hi",
					attributes: {
						"@rend": "italic",
					},
					value: [
						{
							tag: "#text",
							value: "mc",
						},
					],
				},
				{
					tag: "#text",
					value: "^2",
				},
			],
		};
		const screen = await render(
			<TestWrapper>
				<FormulaRend data={document} />
			</TestWrapper>,
		);
		expect(screen.getByRole("figure")).toHaveTextContent("E = mc^2");
	});

	it("should render the display formula with mathml content", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@rend": "display",
			},
			value: [
				{
					tag: "formula",
					attributes: {},
					value: [
						{
							tag: "math",
							attributes: {
								"@xmlns": "http://www.w3.org/1998/Math/MathML",
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
											value: "+",
										},
									],
								},
								{
									tag: "mi",
									value: [
										{
											tag: "#text",
											value: "y",
										},
									],
								},
							],
						},
					],
				},
			],
		};
		const screen = await render(
			<TestWrapper>
				<FormulaRend data={document} />
			</TestWrapper>,
		);

		expect(screen.getByRole("math")).toHaveTextContent("x+y");
	});

	it("should render the display formula with latex content", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@rend": "display",
			},
			value: [
				{
					tag: "formula",
					attributes: {
						"@notation": "tex",
					},
					value: [
						{
							tag: "#text",
							value: "\\frac{a}{b}",
						},
					],
				},
			],
		};
		const screen = await render(
			<TestWrapper>
				<FormulaRend data={document} />
			</TestWrapper>,
		);

		expect(screen.getByRole("math")).toHaveTextContent("ab");
	});

	it("should render mathml formula if both latex and mathml are present", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@rend": "display",
			},
			value: [
				{
					tag: "formula",
					attributes: {
						"@notation": "tex",
					},
					value: "\\frac{a}{b}",
				},
				{
					tag: "formula",
					attributes: {},
					value: [
						{
							tag: "math",
							attributes: {
								"@xmlns": "http://www.w3.org/1998/Math/MathML",
							},
							value: [
								{
									tag: "mfrac",
									value: [
										{
											tag: "mi",
											value: [
												{
													tag: "#text",
													value: "a",
												},
											],
										},
										{
											tag: "mi",
											value: [
												{
													tag: "#text",
													value: "b",
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
		};
		const screen = await render(
			<TestWrapper>
				<FormulaRend data={document} />
			</TestWrapper>,
		);

		expect(screen.getByRole("math")).toHaveTextContent("ab");
	});

	it("should wrap formula inside a div when rend attribute is display", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@rend": "display",
			},
			value: [
				{
					tag: "#text",
					value: "E = mc^2",
				},
			],
		};
		const screen = await render(
			<TestWrapper>
				<FormulaRend data={document} />
			</TestWrapper>,
		);

		screen.debug();

		expect(screen.container.querySelector("div[role='figure']")).toBeDefined();
		expect(
			screen.container.querySelector("div[role='figure']"),
		).toHaveTextContent("E = mc^2");
	});

	it("should wrap formula inside a span when rend attribute is inline", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@rend": "inline",
			},
			value: [
				{
					tag: "#text",
					value: "E = mc^2",
				},
			],
		};
		const screen = await render(
			<TestWrapper>
				<FormulaRend data={document} />
			</TestWrapper>,
		);

		expect(screen.container.querySelector("span[role='figure']")).toBeDefined();
		expect(
			screen.container.querySelector("span[role='figure']"),
		).toHaveTextContent("E = mc^2");
	});

	it("should render image not available for formula with graphic child", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@rend": "inline",
			},
			value: [
				{
					tag: "graphic",
					attributes: {
						"@url": "formula-image.png",
					},
					value: [],
				},
			],
		};
		const screen = await render(
			<TestWrapper>
				<FormulaRend data={document} />
			</TestWrapper>,
		);

		expect(screen.getByText("figure.unloaded")).toBeInTheDocument();
	});
});
