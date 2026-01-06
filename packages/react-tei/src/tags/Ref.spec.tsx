import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentNavigationContext } from "../navigation/DocumentNavigationContext";
import type { DocumentJson } from "../parser/document";
import { getNoteRefId, Ref } from "./Ref";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("Ref", () => {
	describe("getNoteRefId", () => {
		it("should return n attribute when present", () => {
			const attributes = { "@n": "5", "@target": "#note-5" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("5");
		});

		it("should warn when n attribute has several values and return the first one", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const attributes = { "@n": "4 6", "@target": "#note-4" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("4");
			expect(console.warn).toHaveBeenCalledWith(
				"Multiple n attributes found for footnote reference, only the first one will be used",
				{ attributes },
			);
			consoleWarnSpy.mockRestore();
		});

		it("should return target attribute without # when n is missing", () => {
			const attributes = { "@target": "#note-10" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("note-10");
		});

		it("should warn when target attribute has several values and return the first one", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const attributes = { "@target": "#note-8 #note-9" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("note-8");
			expect(console.warn).toHaveBeenCalledWith(
				"Multiple target attributes found for footnote reference, only the first one will be used",
				{ attributes },
			);
			consoleWarnSpy.mockRestore();
		});

		it("should return null when neither n nor target are present", () => {
			const attributes = {};
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBeNull();
		});
	});

	describe("getTargetId", () => {
		it("should return target attribute without # when present", () => {
			const attributes = { "@target": "#ref-12" };
			const id = getNoteRefId(attributes);
			expect(id).toBe("ref-12");
		});

		it("should warn when target attribute has several values and return the first one", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			const attributes = { "@target": "#ref-3 #ref-4" };
			const id = getNoteRefId(attributes);
			expect(id).toBe("ref-3");
			expect(console.warn).toHaveBeenCalledWith(
				"Multiple target attributes found for footnote reference, only the first one will be used",
				{ attributes },
			);
			consoleWarnSpy.mockRestore();
		});

		it("should return null when target is not present", () => {
			const attributes = {};
			const id = getNoteRefId(attributes);
			expect(id).toBeNull();
		});
	});
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
							navigateToBibliographicReference: () => {
								throw new Error(
									"navigateToBibliographicReference has been called",
								);
							},
							navigateToBibliographicReferenceRef: () => {
								throw new Error(
									"navigateToBibliographicReferenceRef has been called",
								);
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

	it('should render a link that navigates to the footnote when type="fn" and target attribute is present', async () => {
		const navigateToFootnote = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "fn", "@target": "#note-7" },
			value: [{ tag: "#text", value: "See footnote 7" }],
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
							navigateToBibliographicReference: () => {
								throw new Error(
									"navigateToBibliographicReference has been called",
								);
							},
							navigateToBibliographicReferenceRef: () => {
								throw new Error(
									"navigateToBibliographicReferenceRef has been called",
								);
							},
						}}
					>
						{children}
					</DocumentNavigationContext.Provider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See footnote 7")).toBeInTheDocument();
		const link = getByRole("button", { name: "See footnote 7" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-fn-id", "note-7");

		await link.click();
		expect(navigateToFootnote).toHaveBeenCalledWith("note-7");
	});

	it('should render a link that navigates to the footnote when type="fn" and target attribute is present', async () => {
		const navigateToFootnote = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "fn", "@target": "#note-7" },
			value: [{ tag: "#text", value: "See footnote 7" }],
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
							navigateToBibliographicReference: () => {
								throw new Error(
									"navigateToBibliographicReference has been called",
								);
							},
							navigateToBibliographicReferenceRef: () => {
								throw new Error(
									"navigateToBibliographicReferenceRef has been called",
								);
							},
						}}
					>
						{children}
					</DocumentNavigationContext.Provider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See footnote 7")).toBeInTheDocument();
		const link = getByRole("button", { name: "See footnote 7" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-fn-id", "note-7");

		await link.click();
		expect(navigateToFootnote).toHaveBeenCalledWith("note-7");
	});

	it('should render text with no link when type="fn" but n and target attributes are missing', async () => {
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
							navigateToBibliographicReference: () => {
								throw new Error(
									"navigateToBibliographicReference has been called",
								);
							},
							navigateToBibliographicReferenceRef: () => {
								throw new Error(
									"navigateToBibliographicReferenceRef has been called",
								);
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
			"No n nor target attribute found for footnote reference",
			{
				attributes: { "@type": "fn" },
				value: [{ tag: "#text", value: "See footnote" }],
			},
		);
		consoleWarnSpy.mockRestore();
	});

	it('should render a link that navigates to the bibliographic reference when type="bibr" and target attribute is present', async () => {
		const navigateToBibliographicReference = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "bibr", "@target": "#bib-2" },
			value: [{ tag: "#text", value: "See bibliographic reference 2" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<DocumentNavigationContext.Provider
						value={{
							navigateToBibliographicReference,
							navigateToFootnote: () => {
								throw new Error("navigateToFootnote has been called");
							},
							navigateToFootnoteRef: () => {
								throw new Error("navigateToFootnoteRef has been called");
							},
							navigateToHeading: () => {
								throw new Error("navigateToHeading has been called");
							},
							navigateToBibliographicReferenceRef: () => {
								throw new Error(
									"navigateToBibliographicReferenceRef has been called",
								);
							},
						}}
					>
						{children}
					</DocumentNavigationContext.Provider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See bibliographic reference 2")).toBeInTheDocument();
		const link = getByRole("button", { name: "See bibliographic reference 2" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-bibref-id", "bib-2");

		await link.click();
		expect(navigateToBibliographicReference).toHaveBeenCalledWith("bib-2");
	});

	it('should render text with no link when type="bibr" but target attribute is missing', async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		const navigateToBibliographicReference = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "bibr" },
			value: [{ tag: "#text", value: "See bibliographic reference" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<DocumentNavigationContext.Provider
						value={{
							navigateToBibliographicReference,
							navigateToFootnote: () => {
								throw new Error("navigateToFootnote has been called");
							},
							navigateToFootnoteRef: () => {
								throw new Error("navigateToFootnoteRef has been called");
							},
							navigateToHeading: () => {
								throw new Error("navigateToHeading has been called");
							},
							navigateToBibliographicReferenceRef: () => {
								throw new Error(
									"navigateToBibliographicReferenceRef has been called",
								);
							},
						}}
					>
						{children}
					</DocumentNavigationContext.Provider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See bibliographic reference")).toBeInTheDocument();
		expect(getByRole("button")).not.toBeInTheDocument();
		expect(navigateToBibliographicReference).not.toHaveBeenCalled();
		expect(console.warn).toHaveBeenCalledWith(
			"No target attribute found for bibliographic reference",
			{
				attributes: { "@type": "bibr" },
				value: [{ tag: "#text", value: "See bibliographic reference" }],
			},
		);
		consoleWarnSpy.mockRestore();
	});

	it('should render text and ignore n attribute when type is not "fn" nor "bibr"', async () => {
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
							navigateToBibliographicReference: () => {
								throw new Error(
									"navigateToBibliographicReference has been called",
								);
							},
							navigateToBibliographicReferenceRef: () => {
								throw new Error(
									"navigateToBibliographicReferenceRef has been called",
								);
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
