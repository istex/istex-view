import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { Term } from "./Term";
import { tagCatalog } from "./tagCatalog";

describe("Term", () => {
	it("should render Term with no rend attribute", async () => {
		const jsonValue: DocumentJson = {
			tag: "term",
			attributes: {},
			value: [{ tag: "#text", value: "A term." }],
		};

		const screen = await render(<Term data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByText("A term.")).toBeVisible();
	});

	it("should render Term with rend attribute", async () => {
		const jsonValue: DocumentJson = {
			tag: "term",
			attributes: { "@rend": "italic" },
			value: [{ tag: "#text", value: "An italic term." }],
		};

		const screen = await render(<Term data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByText("An italic term.")).toBeVisible();
	});
});
