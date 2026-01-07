import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentNavigationContext } from "../../navigation/DocumentNavigationContext";
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
						<DocumentNavigationContext.Provider
							value={{
								navigateToBibliographicReferenceRef,
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
								currentHeadingId: null,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</DocumentNavigationContext.Provider>
					),
				},
			);

			expect(screen.getByRole("button")).toHaveAttribute(
				"data-bibref-id",
				"bib1",
			);
			expect(screen.getByText("An Interesting Article")).toBeInTheDocument();

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
						<DocumentNavigationContext.Provider
							value={{
								navigateToBibliographicReferenceRef,
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
								currentHeadingId: null,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</DocumentNavigationContext.Provider>
					),
				},
			);

			expect(screen.getByRole("button")).toHaveAttribute(
				"data-bibref-id",
				"bib1",
			);
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
						<DocumentNavigationContext.Provider
							value={{
								navigateToBibliographicReferenceRef,
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
								currentHeadingId: null,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</DocumentNavigationContext.Provider>
					),
				},
			);

			expect(screen.getByRole("button")).toHaveAttribute(
				"data-bibref-id",
				"bib1",
			);
			expect(
				screen.getByText("emphasized Title with normal text"),
			).toBeInTheDocument();

			expect(screen.container.querySelector("em")).toBeInTheDocument();
			expect(screen.container.querySelector("em")).toHaveTextContent(
				"Emphasized Title",
			);
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
						<DocumentNavigationContext.Provider
							value={{
								navigateToBibliographicReferenceRef,
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
								currentHeadingId: null,
							}}
						>
							<TagCatalogProvider
								tagCatalog={bibliographicReferencesTagCatalog}
							>
								{children}
							</TagCatalogProvider>
						</DocumentNavigationContext.Provider>
					),
				},
			);

			expect(screen.getByRole("button")).toHaveAttribute(
				"data-bibref-id",
				"bib1",
			);
			expect(
				screen.container.querySelector("div[data-bibref-id='nested1']"),
			).toBeNull();
			expect(
				screen.container.querySelector("div[data-bibref-id='nested2']"),
			).toBeNull();
			expect(screen.getByText("Nested Article 1")).toBeInTheDocument();
			expect(screen.getByText("Nested Article 2")).toBeInTheDocument();

			await screen.getByRole("button").click();
			expect(navigateToBibliographicReferenceRef).toHaveBeenCalledWith("bib1");
		});
	});

	it("should warn when bibl contains mixed nested bibl and other content", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		await render(
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
							tag: "author",
							value: "John Doe",
						},
					],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Bibl contains mixed content with nested bibl and other content:",
			[
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
					tag: "author",
					value: "John Doe",
				},
			],
		);
		consoleWarnSpy.mockRestore();
	});

	it("should not warn when bibl contains only nested bibl and #text elements", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		const screen = await render(
			<Bibl
				data={{
					tag: "bibl",
					attributes: { "@xml:id": "bib1" },
					value: [
						{
							tag: "#text",
							value: "\n  ",
						},
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
							tag: "#text",
							value: "\n",
						},
					],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);
		expect(screen.getByText("Nested Article 1")).toBeInTheDocument();
		expect(consoleWarnSpy).not.toHaveBeenCalled();
		consoleWarnSpy.mockRestore();
	});

	it("should warn when bibl value is not an array", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		await render(
			<Bibl
				data={{
					tag: "bibl",
					attributes: { "@xml:id": "bib1" },
					value: "Just a string",
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Bibl value is not an array:",
			"Just a string",
		);
		consoleWarnSpy.mockRestore();
	});
});
