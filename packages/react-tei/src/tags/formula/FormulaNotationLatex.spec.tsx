import { MathJaxContext } from "better-react-mathjax";
import { afterAll, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FormulaNotationLatex } from "./FormulaNotationLatex";

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

describe("FormulaNotationLatex", () => {
	afterAll(() => {
		vi.resetAllMocks();
	});
	it("should render a latex formula correctly", async () => {
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

		const screen = await render(<FormulaNotationLatex data={document} />, {
			wrapper: TestWrapper,
		});

		// MathMLElement are not supported by toBeInTheDocument
		await expect.element(screen.getByRole("math")).toBeDefined();
		await expect.element(screen.getByRole("math")).toHaveTextContent("Mrc");
	});

	it("should render debug tag when no text content is provided", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@notation": "tex",
			},
			value: [],
		};

		const screen = await render(<FormulaNotationLatex data={document} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.container.querySelector(".debug") as HTMLElement)
			.toBeInTheDocument();
	});

	it("should handle nested text content", async () => {
		const document: DocumentJson = {
			tag: "formula",
			attributes: {
				"@notation": "tex",
			},
			value: [
				{
					tag: "nested",
					attributes: {},
					value: [
						{
							tag: "#text",
							value: "a^2 + b^2 = c^2",
						},
					],
				},
			],
		};

		const screen = await render(<FormulaNotationLatex data={document} />, {
			wrapper: TestWrapper,
		});

		// MathMLElement are not supported by toBeInTheDocument
		await expect.element(screen.getByRole("math")).toBeDefined();
		await expect
			.element(screen.getByRole("math"))
			.toHaveTextContent("a2+b2=c2");
	});
});
