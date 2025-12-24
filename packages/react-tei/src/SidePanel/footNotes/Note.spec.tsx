import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentNavigationContext } from "../../navigation/DocumentNavigationContext";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { footnotesTagCatalog } from "./footnotesTagCatalog";
import { getNoteId, Note } from "./Note";

describe("Note", () => {
	describe("getNoteId", () => {
		it("should return n attribute when present", () => {
			const attributes = { "@n": "7", "@xml:id": "note-7" };
			const noteId = getNoteId(attributes);
			expect(noteId).toBe("7");
		});
		it("should return xml:id attribute when n is missing", () => {
			const attributes = { "@xml:id": "note-15" };
			const noteId = getNoteId(attributes);
			expect(noteId).toBe("note-15");
		});
		it("should return null when neither n nor xml:id are present", () => {
			const attributes = {};
			const noteId = getNoteId(attributes);
			expect(noteId).toBeNull();
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
});
