import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../../parser/document";
import { TagCatalogProvider } from "../../TagCatalogProvider";
import { tagCatalog } from "../../tagCatalog";
import { MathMLTag } from "./MathMLTag";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<TagCatalogProvider tagCatalog={tagCatalog}>{children}</TagCatalogProvider>
	);
}

describe("MathMLTag", () => {
	it("should render MathML content correctly", async () => {
		const mathMLData: DocumentJson = {
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
		};

		const screen = await render(<MathMLTag data={mathMLData} />, {
			wrapper: TestWrapper,
		});

		await expect.element(screen.getByRole("math")).toHaveTextContent("x+y");
	});
});
