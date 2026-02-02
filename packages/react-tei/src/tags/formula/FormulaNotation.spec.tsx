import { MathJaxContext } from "better-react-mathjax";
import { afterAll, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FormulaNotation, getFormulaType } from "./FormulaNotation";

vi.mock("../../debug/debug.const", () => {
	return {
		IS_DEBUG: true,
	};
});

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<MathJaxContext>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				{children}
			</TagCatalogProvider>
		</MathJaxContext>
	);
}

describe("FormulaNotation", () => {
	afterAll(() => {
		vi.resetAllMocks();
	});
	it("should render mathml notation correctly", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@notation": "mathml",
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

		const screen = await render(<FormulaNotation data={document} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("figure")).toHaveTextContent("x+y");
		await expect.element(screen.getByRole("math")).toHaveTextContent("x+y");
	});

	it("should render latex notation correctly", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@notation": "tex",
			},
			value: [
				{
					tag: "#text",
					value: "\\hbox{$M_r^c$}",
				},
			],
		};

		const screen = await render(<FormulaNotation data={document} />, {
			wrapper: TestWrapper,
		});

		// MathMLElement are not supported by toBeInTheDocument
		await expect.element(screen.getByRole("math")).toBeDefined();
		await expect.element(screen.getByRole("math")).toHaveTextContent("Mrc");
	});

	it("should render text notation correctly", async () => {
		const document: DocumentJson = {
			tag: "formula",
			value: [
				{
					tag: "hi",
					attributes: {
						"@rend": "italic",
					},
					value: "E",
				},
				{
					tag: "#text",
					value: " = mc",
				},
				{
					tag: "hi",
					attributes: {
						"@rend": "superscript",
					},
					value: "2",
				},
			],
		};

		const screen = await render(<FormulaNotation data={document} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByText("E = mc2")).toBeInTheDocument();
	});

	it("should render debug tag when unsupported notation is provided", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@notation": "unsupported",
			},
			value: [],
		};

		const screen = await render(<FormulaNotation data={document} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});

	it("should render debug tag when no notation is provided and value is not an array", async () => {
		const document: DocumentJson = {
			tag: "formula",
			value: "invalid value",
		};

		const screen = await render(<FormulaNotation data={document} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});

	describe("getFormulaType", () => {
		it("should return 'latex' for tex notation", () => {
			const document: DocumentJson = {
				tag: "formula",
				attributes: {
					"@notation": "tex",
				},
				value: [],
			};

			const formulaType = getFormulaType(document);
			expect(formulaType).toBe("latex");
		});

		it("should return 'mathml' for mathml notation", () => {
			const document: DocumentJson = {
				tag: "formula",
				attributes: {
					"@notation": "mathml",
				},
				value: [],
			};

			const formulaType = getFormulaType(document);
			expect(formulaType).toBe("mathml");
		});

		it("should infer 'mathml' notation from tag value if it contains math tag", () => {
			const document: DocumentJson = {
				tag: "formula",
				attributes: {},
				value: [
					{
						tag: "math",
						attributes: {},
						value: [],
					},
				],
			};

			const formulaType = getFormulaType(document);
			expect(formulaType).toBe("mathml");
		});

		it("should infer 'mathml' notation from tag value if it contains a namespaced math tag", () => {
			const document: DocumentJson = {
				tag: "formula",
				attributes: {},
				value: [
					{
						tag: "mml:math",
						attributes: {},
						value: [],
					},
				],
			};

			const formulaType = getFormulaType(document);
			expect(formulaType).toBe("mathml");
		});

		it("should infer 'latex' notation from tag value if it contains latex text", () => {
			const document: DocumentJson = {
				tag: "formula",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "\\frac{a}{b}",
					},
				],
			};

			const formulaType = getFormulaType(document);
			expect(formulaType).toBe("latex");
		});

		it("should return 'text' notation if no notation attribute and no recognizable content", () => {
			const document: DocumentJson = {
				tag: "formula",
				attributes: {},
				value: [
					{
						tag: "#text",
						value: "just some text",
					},
				],
			};

			const formulaType = getFormulaType(document);
			expect(formulaType).toBe("text");
		});

		it("should return 'error' notation if value is not an array", () => {
			const document: DocumentJson = {
				tag: "formula",
				attributes: {},
				value: "invalid value" as unknown as DocumentJson[],
			};

			const formulaType = getFormulaType(document);
			expect(formulaType).toBe("error");
		});
	});
});
