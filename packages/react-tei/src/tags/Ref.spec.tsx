import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentNavigationContext } from "../navigation/DocumentNavigationContext";
import type { DocumentJson } from "../parser/document";
import { Ref } from "./Ref";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("Ref", () => {
	it('should render a link that navigates to the footnote when type="fn" and n attribute is present', async () => {
		const navigateToFootnote = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "fn", "@n": "3" },
			value: [{ tag: "#text", value: "See footnote 3" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<DocumentNavigationContext.Provider
						value={{
							navigateToFootnote,
							navigateToFootnoteRef: () => {
								throw new Error("navigateToFootnoteRef has been called");
							},
							navigateToHeading: () => {
								throw new Error("navigateToHeading has been called");
							},
						}}
					>
						{children}
					</DocumentNavigationContext.Provider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See footnote 3")).toBeInTheDocument();
		const link = getByRole("button", { name: "See footnote 3" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-fn-id", "3");

		await link.click();
		expect(navigateToFootnote).toHaveBeenCalledWith("3");
	});

	it('should render text with no link when type="fn" but n attribute is missing', async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		const navigateToFootnote = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "fn" },
			value: [{ tag: "#text", value: "See footnote" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<DocumentNavigationContext.Provider
						value={{
							navigateToFootnote,
							navigateToFootnoteRef: () => {
								throw new Error("navigateToFootnoteRef has been called");
							},
							navigateToHeading: () => {
								throw new Error("navigateToHeading has been called");
							},
						}}
					>
						{children}
					</DocumentNavigationContext.Provider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See footnote")).toBeInTheDocument();
		expect(getByRole("button")).not.toBeInTheDocument();
		expect(navigateToFootnote).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			"No n attribute found for footnote reference",
			{
				attributes: { "@type": "fn" },
				value: [{ tag: "#text", value: "See footnote" }],
			},
		);
		consoleWarnSpy.mockRestore();
	});

	it('should render text and ignore n attribute when type is not "fn"', async () => {
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: {
				"@type": "other",
				"@n": "5",
			},
			value: [{ tag: "#text", value: "Just a reference" }],
		};

		const { getByRole, getByText } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});
		expect(getByText("Just a reference")).toBeInTheDocument();

		expect(getByRole("button", { name: "5" })).not.toBeInTheDocument();
	});

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

	it("should warn when n attributes has several values and use the first one", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		const navigateToFootnote = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "fn", "@n": "4 5" },
			value: [{ tag: "#text", value: "See footnote 4" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<DocumentNavigationContext.Provider
						value={{
							navigateToFootnote,
							navigateToFootnoteRef: () => {
								throw new Error("navigateToFootnoteRef has been called");
							},
							navigateToHeading: () => {
								throw new Error("navigateToHeading has been called");
							},
						}}
					>
						{children}
					</DocumentNavigationContext.Provider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See footnote 4")).toBeInTheDocument();
		const link = getByRole("button", { name: "See footnote 4" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-fn-id", "4");

		await link.click();
		expect(navigateToFootnote).toHaveBeenCalledWith("4");
		expect(console.warn).toHaveBeenCalledWith(
			"Multiple n attributes found for footnote reference, only the first one will be used",
			{ attributes: { "@type": "fn", "@n": "4 5" } },
		);
		consoleWarnSpy.mockRestore();
	});
});
