import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../../parser/document";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { tagCatalog } from "../tagCatalog";
import { FloatingText } from "./FloatingText";

describe("FloatingText", () => {
	it("should render FloatingText with default border for non-statement type", async () => {
		const jsonValue: DocumentJson = {
			tag: "floatingText",
			attributes: { "@type": "block" },
			value: [{ tag: "#text", value: "This is a block floating text." }],
		};

		const screen = await render(<FloatingText data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByText("This is a block floating text.")).toBeVisible();
	});

	it("should render FloatingText with statement style border", async () => {
		const jsonValue: DocumentJson = {
			tag: "floatingText",
			attributes: { "@type": "statement" },
			value: [{ tag: "#text", value: "This is a statement." }],
		};

		const screen = await render(<FloatingText data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByText("This is a statement.")).toBeVisible();
	});
});
