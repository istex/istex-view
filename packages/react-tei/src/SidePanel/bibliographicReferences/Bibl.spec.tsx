import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Bibl } from "./Bibl";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";

describe("Bibl", () => {
	describe("Bibl", () => {
		it("should render bibl with data-bibref-id attribute and link toward target when present", async () => {
			const navigateToBibliographicReferenceRef = vi.fn();
			const screen = await render(
				<Bibl
					data={{
						tag: "bibl",
						attributes: { "@xml:id": "bib1" },
						value: [
							{
								tag: "title",
								attributes: { "@level": "a" },
								value: "An Interesting Article",
							},
						],
					}}
				/>,
				{
					wrapper: ({ children }) => (
						<TestDocumentNavigationContextProvider
							value={{
								navigateToBibliographicReferenceRef,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</TestDocumentNavigationContextProvider>
					),
				},
			);

			await expect
				.element(screen.getByRole("note"))
				.toHaveAttribute("data-bibref-id", "bib1");
			await expect
				.element(screen.getByText("An Interesting Article"))
				.toBeInTheDocument();

			await screen.getByRole("button").click();
			expect(navigateToBibliographicReferenceRef).toHaveBeenCalledWith("bib1");
		});

		it("should render all children element #text when no nested bibl is present", async () => {
			const navigateToBibliographicReferenceRef = vi.fn();
			const screen = await render(
				<Bibl
					data={{
						tag: "bibl",
						attributes: { "@xml:id": "bib1" },
						value: [
							{
								tag: "author",
								value: "John Doe",
							},
							{
								tag: "#text",
								value: ", ",
							},
							{
								tag: "title",
								attributes: { "@level": "a" },
								value: "An Interesting Article",
							},
							{
								tag: "#text",
								value: " (Approved)",
							},
						],
					}}
				/>,
				{
					wrapper: ({ children }) => (
						<TestDocumentNavigationContextProvider
							value={{
								navigateToBibliographicReferenceRef,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</TestDocumentNavigationContextProvider>
					),
				},
			);

			await expect
				.element(screen.getByRole("note"))
				.toHaveAttribute("data-bibref-id", "bib1");
			expect(
				screen.getByText("John Doe, An interesting Article (Approved)"),
			).toBeInTheDocument();
		});

		it("should render hi elements inside bibl", async () => {
			const navigateToBibliographicReferenceRef = vi.fn();
			const screen = await render(
				<Bibl
					data={{
						tag: "bibl",
						attributes: { "@xml:id": "bib1" },
						value: [
							{
								tag: "title",
								attributes: { "@level": "a" },
								value: [
									{
										tag: "hi",
										attributes: { "@rend": "italic" },
										value: "Emphasized Title",
									},
									{
										tag: "#text",
										value: " with normal text",
									},
								],
							},
						],
					}}
				/>,
				{
					wrapper: ({ children }) => (
						<TestDocumentNavigationContextProvider
							value={{
								navigateToBibliographicReferenceRef,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</TestDocumentNavigationContextProvider>
					),
				},
			);

			await expect
				.element(screen.getByRole("note"))
				.toHaveAttribute("data-bibref-id", "bib1");
			expect(
				screen.getByText("emphasized Title with normal text"),
			).toBeInTheDocument();

			await expect
				.element(screen.container.querySelector("em"))
				.toBeInTheDocument();
			await expect
				.element(screen.container.querySelector("em"))
				.toHaveTextContent("Emphasized Title");
		});

		it("should render only top level reference when encountering nested bibl", async () => {
			const navigateToBibliographicReferenceRef = vi.fn();
			const screen = await render(
				<Bibl
					data={{
						tag: "bibl",
						attributes: { "@xml:id": "bib1" },
						value: [
							{
								tag: "bibl",
								attributes: {
									" @xml:id": "nested1",
								},
								value: [
									{
										tag: "title",
										attributes: { "@level": "a" },
										value: "Nested Article 1",
									},
								],
							},
							{
								tag: "bibl",
								attributes: {
									" @xml:id": "nested2",
								},
								value: [
									{
										tag: "title",
										attributes: { "@level": "j" },
										value: "Nested article 2",
									},
								],
							},
						],
					}}
				/>,
				{
					wrapper: ({ children }) => (
						<TestDocumentNavigationContextProvider
							value={{
								navigateToBibliographicReferenceRef,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</TestDocumentNavigationContextProvider>
					),
				},
			);

			await expect
				.element(screen.getByRole("note"))
				.toHaveAttribute("data-bibref-id", "bib1");
			expect(
				screen.container.querySelector("div[data-bibref-id='nested1']"),
			).toBeNull();
			expect(
				screen.container.querySelector("div[data-bibref-id='nested2']"),
			).toBeNull();
			await expect
				.element(screen.getByText("Nested Article 1"))
				.toBeInTheDocument();
			await expect
				.element(screen.getByText("Nested Article 2"))
				.toBeInTheDocument();

			await screen.getByRole("button").click();
			expect(navigateToBibliographicReferenceRef).toHaveBeenCalledWith("bib1");
		});
	});
});
