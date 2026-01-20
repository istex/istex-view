import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import type { DocumentJson } from "../parser/document";
import { Formula } from "./Formula";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("Formula", () => {
	it("should render mathml formula with prefix", async () => {
		const jsonDocument: DocumentJson = {
			tag: "formula",
			attributes: {
				"@notation": "mathml",
			},
			value: [
				{
					tag: "mml:math",
					attributes: {
						"@xmlns:mml": "http://www.w3.org/1998/Math/MathML",
					},
					value: [
						{
							tag: "mml:mi",
							attributes: {},
							value: "x",
						},
						{
							tag: "mml:mo",
							attributes: {},
							value: "+",
						},
						{
							tag: "mml:mi",
							attributes: {},
							value: "y",
						},
					],
				},
			],
		};

		const screen = await render(<Formula data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("figure")).toHaveTextContent("x+y");
	});

	it("should render mathml formula without prefix", async () => {
		const jsonDocument: DocumentJson = {
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
									attributes: {},
									value: "a",
								},
								{
									tag: "mo",
									attributes: {},
									value: "=",
								},
								{
									tag: "mi",
									attributes: {},
									value: "b",
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(<Formula data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("figure")).toHaveTextContent("a=b");
	});
});
