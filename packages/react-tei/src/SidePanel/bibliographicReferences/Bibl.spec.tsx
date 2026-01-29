import Box from "@mui/material/Box";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentNavigationContextValue } from "../../navigation/DocumentNavigationContext";
import { TestDocumentNavigationContextProvider } from "../../navigation/TestDocumentNavigationContextProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Bibl } from "./Bibl";
import { bibliographicReferenceSectionSx } from "./BibliographiceferencesSection";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";

export function TestWrapper({
	children,
	navigateToBibliographicReferenceRef,
}: {
	children: React.ReactNode;
	navigateToBibliographicReferenceRef: DocumentNavigationContextValue["navigateToBibliographicReferenceRef"];
}) {
	return (
		<I18nProvider>
			<TestDocumentNavigationContextProvider
				value={{
					navigateToBibliographicReferenceRef,
				}}
			>
				<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
					<Box sx={bibliographicReferenceSectionSx}>{children}</Box>
				</TagCatalogProvider>
			</TestDocumentNavigationContextProvider>
		</I18nProvider>
	);
}

describe("Bibl", () => {
	it("should render bibl with data-bibref-id attribute and link toward target when present", async () => {
		const querySelectorAll = vi.fn().mockImplementation(() => {
			return [document.createElement("span"), document.createElement("span")];
		});
		vi.spyOn(document.body, "querySelectorAll").mockImplementationOnce(
			querySelectorAll,
		);

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
					<TestWrapper
						navigateToBibliographicReferenceRef={
							navigateToBibliographicReferenceRef
						}
					>
						{children}
					</TestWrapper>
				),
			},
		);

		await expect
			.element(screen.getByRole("note"))
			.toHaveAttribute("data-bibref-id", "bib1");
		await expect
			.element(screen.getByText("An Interesting Article"))
			.toBeInTheDocument();

		await screen
			.getByRole("button", {
				name: "Aller au suivant",
			})
			.click();
		expect(navigateToBibliographicReferenceRef).toHaveBeenCalledWith(
			"bib1",
			"next",
		);

		await screen
			.getByRole("button", {
				name: "Aller au précédent",
			})
			.click();
		expect(navigateToBibliographicReferenceRef).toHaveBeenCalledWith(
			"bib1",
			"previous",
		);
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
					<TestWrapper
						navigateToBibliographicReferenceRef={
							navigateToBibliographicReferenceRef
						}
					>
						{children}
					</TestWrapper>
				),
			},
		);

		await expect
			.element(screen.getByRole("note"))
			.toHaveAttribute("data-bibref-id", "bib1");
		expect(
			screen.getByText("John Doe, An Interesting Article (Approved)"),
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
					<TestWrapper
						navigateToBibliographicReferenceRef={
							navigateToBibliographicReferenceRef
						}
					>
						{children}
					</TestWrapper>
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
		const querySelectorAll = vi.fn().mockImplementation(() => {
			return [document.createElement("span"), document.createElement("span")];
		});
		vi.spyOn(document.body, "querySelectorAll").mockImplementationOnce(
			querySelectorAll,
		);

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
					<TestWrapper
						navigateToBibliographicReferenceRef={
							navigateToBibliographicReferenceRef
						}
					>
						{children}
					</TestWrapper>
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
	});

	it("should not display previous button when there is only one target", async () => {
		const querySelectorAll = vi.fn().mockImplementation(() => {
			return [document.createElement("span")];
		});
		vi.spyOn(document.body, "querySelectorAll").mockImplementationOnce(
			querySelectorAll,
		);

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
					<TestWrapper
						navigateToBibliographicReferenceRef={
							navigateToBibliographicReferenceRef
						}
					>
						{children}
					</TestWrapper>
				),
			},
		);

		expect(
			screen.getByRole("button", {
				name: "Aller au suivant",
			}),
		).not.toBeDisabled();

		expect(
			screen.getByRole("button", {
				name: "Aller au précédent",
			}),
		).not.toBeInTheDocument();
	});

	it("should disable next button when there is no target", async () => {
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
					<TestWrapper
						navigateToBibliographicReferenceRef={
							navigateToBibliographicReferenceRef
						}
					>
						{children}
					</TestWrapper>
				),
			},
		);

		expect(
			screen.getByRole("button", {
				name: "Aller au suivant",
			}),
		).toBeDisabled();

		expect(
			screen.getByRole("button", {
				name: "Aller au précédent",
			}),
		).not.toBeInTheDocument();
	});
});
