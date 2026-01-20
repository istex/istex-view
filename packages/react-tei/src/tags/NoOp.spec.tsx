import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { NoOp } from "./NoOp";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("NoOp", () => {
	it("should render value without transformation", async () => {
		const jsonValue: DocumentJson = {
			tag: "noOp",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a test." },
				{
					tag: "hi",
					attributes: { rend: "bold" },
					value: [{ tag: "#text", value: "Bold Text" }],
				},
			],
		};

		const screen = await render(<NoOp data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.getByText("This is a test."))
			.toBeInTheDocument();
		await expect.element(screen.getByText("Bold Text")).toBeInTheDocument();
	});
});
