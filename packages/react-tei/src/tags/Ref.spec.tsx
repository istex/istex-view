import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { TestDocumentNavigationContextProvider } from "../navigation/TestDocumentNavigationContextProvider";
import type { DocumentJson, DocumentJsonValue } from "../parser/document";
import { DocumentRef, getNoteRefId, isURI, Ref, UriRef } from "./Ref";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

describe("isURI", () => {
	it("should return true for valid URIs", () => {
		expect(isURI("https://example.com")).toBe(true);
		expect(isURI("http://example.com")).toBe(true);
	});

	it("should return false for invalid URIs", () => {
		expect(isURI("not a uri")).toBe(false);
		expect(isURI("")).toBe(false);
		expect(isURI(null)).toBe(false);
	});
});

describe("UriRef", () => {
	it.each<DocumentJsonValue[]>([
		[[{ tag: "#text", value: "https://example.com" }]],
		[
			[
				{ tag: "#text", value: "\n" },
				{ tag: "#text", value: "https://example.com" },
				{ tag: "#text", value: " " },
			],
		],
	])("should render an URI with a link in value", async (value) => {
		const document: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "uri" },
			value,
		};

		const screen = await render(<UriRef data={document} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const link = screen.getByRole("link", { name: "https://example.com" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "https://example.com");
	});

	it("should render an URI with a link in @target attribute", async () => {
		const document: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "uri", "@target": "https://example.com" },
			value: [{ tag: "#text", value: "Example link" }],
		};

		const screen = await render(<UriRef data={document} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const link = screen.getByRole("link", { name: "Example link" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "https://example.com");
	});

	it("should render value and warn when no URI is found", async () => {
		const document: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "uri" },
			value: [{ tag: "#text", value: "No link here" }],
		};

		const screen = await render(<UriRef data={document} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.getByText("No link here")).toBeInTheDocument();
	});

	it("should render value and warn when ref is empty", async () => {
		const document: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "uri" },
			value: [],
		};

		const screen = await render(<UriRef data={document} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.container).toBeEmptyDOMElement();
	});
});

describe("DocumentRef", () => {
	it("should render a link that navigates to the targeted element on click", async () => {
		const navigateToBodyTargetSelector = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "table", "@target": "#2" },
			value: [{ tag: "#text", value: "See Table 2" }],
		};

		const { getByText, getByRole } = await render(
			<DocumentRef
				data={jsonValue}
				elementIdFn={(target) => `table-${target}`}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={tagCatalog}>
						<TestDocumentNavigationContextProvider
							value={{
								navigateToBodyTargetSelector,
							}}
						>
							{children}
						</TestDocumentNavigationContextProvider>
					</TagCatalogProvider>
				),
			},
		);
		expect(getByText("See Table 2")).toBeInTheDocument();
		const link = getByRole("button", { name: "See Table 2" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-target", "#table-2");

		await link.click();
		expect(navigateToBodyTargetSelector).toHaveBeenCalledWith("#table-2");
	});
});

describe("Ref", () => {
	describe("getNoteRefId", () => {
		it("should return favor target attribute before n attribute", () => {
			const attributes = { "@n": "5", "@target": "#note-5" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("note-5");
		});

		it("should return n attribute when no target present", () => {
			const attributes = { "@n": "5" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("5");
		});

		it("should return all n attributes without a hash", () => {
			const attributes = { "@n": "4 6" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("4 6");
		});

		it("should return target attribute without #", () => {
			const attributes = { "@target": "#note-10" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("note-10");
		});

		it("should return all target attributes without a hash", () => {
			const attributes = { "@target": "#note-8 #note-9" };
			const noteId = getNoteRefId(attributes);
			expect(noteId).toBe("note-8 note-9");
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

		it("should return all target attributes without a hash", () => {
			const attributes = { "@target": "#ref-3 #ref-4" };
			const id = getNoteRefId(attributes);
			expect(id).toBe("ref-3 ref-4");
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
					<TestDocumentNavigationContextProvider
						value={{
							navigateToFootnote,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
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
					<TestDocumentNavigationContextProvider
						value={{
							navigateToFootnote,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
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
					<TestDocumentNavigationContextProvider
						value={{
							navigateToFootnote,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
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
		const navigateToFootnote = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "fn" },
			value: [{ tag: "#text", value: "See footnote" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<TestDocumentNavigationContextProvider
						value={{
							navigateToFootnote,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See footnote")).toBeInTheDocument();
		expect(getByRole("button")).not.toBeInTheDocument();
		expect(navigateToFootnote).not.toHaveBeenCalled();
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
					<TestDocumentNavigationContextProvider
						value={{
							navigateToBibliographicReference,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
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
		const navigateToBibliographicReference = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "bibr" },
			value: [{ tag: "#text", value: "See bibliographic reference" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<TestDocumentNavigationContextProvider
						value={{
							navigateToBibliographicReference,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See bibliographic reference")).toBeInTheDocument();
		expect(getByRole("button")).not.toBeInTheDocument();
		expect(navigateToBibliographicReference).not.toHaveBeenCalled();
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
		await expect.element(screen.getByText("Hello")).toBeInTheDocument();
	});

	it.each<DocumentJsonValue[]>([
		[[{ tag: "#text", value: "https://example.com" }]],
		[
			[
				{ tag: "#text", value: "\n" },
				{ tag: "#text", value: "https://example.com" },
				{ tag: "#text", value: " " },
			],
		],
	])("should render an URI with a link in value", async (value) => {
		const document: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "uri" },
			value,
		};

		const screen = await render(<Ref data={document} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const link = screen.getByRole("link", { name: "https://example.com" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "https://example.com");
	});

	it("should render an URI with a link with type uri", async () => {
		const document: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "uri", "@target": "https://example.com" },
			value: [{ tag: "#text", value: "Example link" }],
		};

		const screen = await render(<Ref data={document} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const link = screen.getByRole("link", { name: "Example link" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "https://example.com");
	});

	it("should render an URI with a uri in @target attribute", async () => {
		const document: DocumentJson = {
			tag: "ref",
			attributes: { "@target": "https://example.com" },
			value: [{ tag: "#text", value: "Example link" }],
		};

		const screen = await render(<Ref data={document} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const link = screen.getByRole("link", { name: "Example link" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("href", "https://example.com");
	});

	it('should renter table reference when type="table"', async () => {
		const navigateToBodyTargetSelector = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "table", "@target": "#2" },
			value: [{ tag: "#text", value: "See Table 2" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<TestDocumentNavigationContextProvider
						value={{
							navigateToBodyTargetSelector,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See Table 2")).toBeInTheDocument();
		const link = getByRole("button", { name: "See Table 2" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-target", "#table-2");

		await link.click();
		expect(navigateToBodyTargetSelector).toHaveBeenCalledWith("#table-2");
	});

	it("should render table fn reference when type is table-fn", async () => {
		const navigateToBodyTargetSelector = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "table-fn", "@target": "#3" },
			value: [{ tag: "#text", value: "See Table Footnote 3" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<TestDocumentNavigationContextProvider
						value={{
							navigateToBodyTargetSelector,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See Table Footnote 3")).toBeInTheDocument();
		const link = getByRole("button", { name: "See Table Footnote 3" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-target", "#table-note-3");

		await link.click();
		expect(navigateToBodyTargetSelector).toHaveBeenCalledWith("#table-note-3");
	});

	it('should renter formula reference when type="formula"', async () => {
		const navigateToBodyTargetSelector = vi.fn();
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: { "@type": "formula", "@target": "#2" },
			value: [{ tag: "#text", value: "See Formula 2" }],
		};

		const { getByText, getByRole } = await render(<Ref data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					<TestDocumentNavigationContextProvider
						value={{
							navigateToBodyTargetSelector,
						}}
					>
						{children}
					</TestDocumentNavigationContextProvider>
				</TagCatalogProvider>
			),
		});
		expect(getByText("See Formula 2")).toBeInTheDocument();
		const link = getByRole("button", { name: "See Formula 2" });
		expect(link).toBeInTheDocument();
		expect(link).toHaveAttribute("data-target", "#2");

		await link.click();
		expect(navigateToBodyTargetSelector).toHaveBeenCalledWith("#2");
	});
});
