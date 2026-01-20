import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FormulaRendInline } from "./FormulaRendInline";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TagCatalogProvider tagCatalog={tagCatalog}>{children}</TagCatalogProvider>
	);
}

describe("FormulaRendInline", () => {
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
				<FormulaRendInline data={document} />
			</TestWrapper>,
		);
		expect(screen.getByRole("figure")).toHaveTextContent("E = mc^2");
	});
});
