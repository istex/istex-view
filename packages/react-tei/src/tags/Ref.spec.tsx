import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { DocumentJson } from "../parser/document";
import { Ref } from "./Ref";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("Ref", () => {
	it("should render text", async () => {
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: {},
			value: [
				{
					tag: "#text",
					attributes: {},
					value: "Hello",
				},
			],
		};

		const screen = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});
});
