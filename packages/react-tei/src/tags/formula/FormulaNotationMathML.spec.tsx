import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FormulaNotation } from "./FormulaNotation";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TagCatalogProvider tagCatalog={tagCatalog}>{children}</TagCatalogProvider>
	);
}

describe("FormulaNotationMathML", () => {
	it("should render mathml notation correctly", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@notation": "mathml",
			},
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
		};

		const screen = await render(<FormulaNotation data={document} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("figure")).toHaveTextContent("x+y");
		await expect.element(screen.getByRole("math")).toHaveTextContent("x+y");
	});

	it("should render mathml notation with nested formula correctly", async () => {
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
									value: [{ tag: "#text", value: "a" }],
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
											value: "b",
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

		await expect.element(screen.getByRole("figure")).toHaveTextContent("a+b");
		await expect.element(screen.getByRole("math")).toHaveTextContent("a+b");
	});
});
