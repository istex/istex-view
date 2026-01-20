import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FormulaRendDisplay } from "./FormulaRendDisplay";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TagCatalogProvider tagCatalog={tagCatalog}>{children}</TagCatalogProvider>
	);
}

describe("FormulaRendDisplay", () => {
	it("should render the display formula", async () => {
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
				<FormulaRendDisplay data={document} />
			</TestWrapper>,
		);

		expect(screen.getByRole("figure")).toHaveTextContent("x+y");
		expect(screen.getByRole("math")).toHaveTextContent("x+y");
	});

	it("should not render tex formula if mathml is present", async () => {
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
				<FormulaRendDisplay data={document} />
			</TestWrapper>,
		);

		expect(screen.getByRole("figure")).toHaveTextContent("ab");
		expect(screen.getByRole("math")).toHaveTextContent("ab");
	});
});
