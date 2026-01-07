import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentNavigationContext } from "../../navigation/DocumentNavigationContext";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { footnotesTagCatalog } from "./footnotesTagCatalog";
import { getNoteId, Note } from "./Note";

describe("Note", () => {
	describe("getNoteId", () => {
		it("should favor xml:id attribute over n attribute for id", () => {
			const attributes = { "@n": "7", "@xml:id": "note-7" };
			const noteId = getNoteId(attributes);
			expect(noteId).toStrictEqual({
				id: "note-7",
				label: "7",
			});
		});

		it("should favor n attribute over xml:id attribute for label", () => {
			const attributes = { "@n": "7", "@xml:id": "note-7" };
			const noteId = getNoteId(attributes);
			expect(noteId).toStrictEqual({
				id: "note-7",
				label: "7",
			});
		});

		it("should return n attribute when no target attribute is present", () => {
			const attributes = { "@n": "7" };
			const noteId = getNoteId(attributes);
			expect(noteId).toStrictEqual({
				id: "7",
				label: "7",
			});
		});

		it("should return xml:id attribute as label when n is missing", () => {
			const attributes = { "@xml:id": "note-15" };
			const noteId = getNoteId(attributes);
			expect(noteId).toStrictEqual({
				id: "note-15",
				label: "note-15",
			});
		});

		it("should return null when neither n nor xml:id are present", () => {
			const attributes = {};
			const noteId = getNoteId(attributes);
			expect(noteId).toStrictEqual({
				id: null,
				label: null,
			});
		});
	});
	it("should render the note value with a link toward n-<value> when n attribute is present", async () => {
		const navigateToFootnoteRef = vi.fn();
		const { getByText, getByRole } = await render(
			<Note
				data={{
					tag: "note",
					attributes: { "@n": "2" },
					value: [{ tag: "#text", value: "This is another footnote." }],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<DocumentNavigationContext.Provider
						value={{
							navigateToFootnoteRef,
							navigateToFootnote: () => {
								throw new Error("navigateToFootnote has been called");
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
						<TagCatalogProvider tagCatalog={footnotesTagCatalog}>
							{children}
						</TagCatalogProvider>
					</DocumentNavigationContext.Provider>
				),
			},
		);

		expect(getByText("This is another footnote.")).toBeInTheDocument();
		expect(getByRole("button", { name: "2" })).toBeInTheDocument();
		expect(getByText("2")).toHaveAttribute("data-fn-id", "2");

		await getByText("2").click();
		expect(navigateToFootnoteRef).toHaveBeenCalledWith("2");
	});

	it("should render the note value without link when n attribute is missing", async () => {
		const { getByText, getByRole } = await render(
			<Note
				data={{
					tag: "note",
					value: [
						{ tag: "#text", value: "This is a footnote without n attribute." },
					],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<DocumentNavigationContext.Provider
						value={{
							navigateToFootnoteRef: () => {
								throw new Error("navigateToFootnoteRef has been called");
							},
							navigateToFootnote: () => {
								throw new Error("navigateToFootnote has been called");
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
						<TagCatalogProvider tagCatalog={footnotesTagCatalog}>
							{children}
						</TagCatalogProvider>
					</DocumentNavigationContext.Provider>
				),
			},
		);

		expect(
			getByText("This is a footnote without n attribute."),
		).toBeInTheDocument();
		expect(getByRole("button")).not.toBeInTheDocument();
	});

	it("should support nested ref", async () => {
		const { getByText } = await render(
			<Note
				data={{
					tag: "note",
					value: [
						{
							tag: "ref",
							attributes: { "@type": "uri" },
							value: [{ tag: "#text", value: "https://www.lodex.fr/" }],
						},
					],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<DocumentNavigationContext.Provider
						value={{
							navigateToFootnoteRef: () => {
								throw new Error("navigateToFootnoteRef has been called");
							},
							navigateToFootnote: () => {
								throw new Error("navigateToFootnote has been called");
							},
							navigateToHeading: () => {
								throw new Error("navigateToHeading has been called");
							},
						}}
					>
						<TagCatalogProvider tagCatalog={footnotesTagCatalog}>
							{children}
						</TagCatalogProvider>
					</DocumentNavigationContext.Provider>
				),
			},
		);

		expect(getByText("https://www.lodex.fr/")).toBeInTheDocument();
	});
});
