import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { bibliographicReferencesTagCatalog } from "../SidePanel/bibliographicReferences/bibliographicReferencesTagCatalog";
import { DateTag } from "./DateTag";
import { TagCatalogProvider } from "./TagCatalogProvider";

describe("DateTag", () => {
	it("should render DateTag value", async () => {
		const data = {
			tag: "date",
			value: [
				{
					tag: "#text",
					value: "2023-10-05",
				},
			],
		};
		const screen = await render(<DateTag data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		expect(screen.container.textContent).toBe("2023-10-05");
	});
	it("should return the @when attribute when value is empty", async () => {
		const data = {
			tag: "date",
			value: [],
			attributes: { "@when": "2022" },
		};
		const screen = await render(<DateTag data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		expect(screen.container.textContent).toBe("2022");
	});
	it("should return the @when attribute when no value", async () => {
		const data = {
			tag: "date",
			attributes: { "@when": "2022" },
		};
		const screen = await render(<DateTag data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		expect(screen.container.textContent).toBe("2022");
	});

	it("should return null if no value and @when attribute is missing", async () => {
		const data = {
			tag: "date",
		};
		const screen = await render(<DateTag data={data} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		await expect.element(screen.container).toBeEmptyDOMElement();
	});
});
