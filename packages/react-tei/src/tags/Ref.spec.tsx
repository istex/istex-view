import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { DocumentJson } from "../parser/document.js";
import { Ref } from "./Ref.js";
import { TagCatalogProvider } from "./TagCatalogProvider.js";
import { tagCatalog } from "./tagCatalog.js";

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
