import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentNavigationContext } from "../../navigation/DocumentNavigationContext";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { Bibl, BiblValue, getTagOrder } from "./Bibl";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";

describe("Bibl", () => {
	describe("getTagOrder", () => {
		it.each([
			[{ tag: "title", value: [] }, 4],
			[{ tag: "title", attributes: { "@level": "a" }, value: [] }, 1],
			[{ tag: "author", value: [] }, 2],
			[{ tag: "date", value: [] }, 3],
			[
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@from": "19" },
					value: [],
				},
				6,
			],
			[
				{
					tag: "biblScope",
					attributes: { "@unit": "page", "@to": "42" },
					value: [],
				},
				7,
			],
			[{ tag: "biblScope", attributes: { "@unit": "unknown" }, value: [] }, 8],
			[{ tag: "biblScope", attributes: { "@unit": "vol" }, value: [] }, 5],
			[{ tag: "publisher", value: [] }, 9],
			[{ tag: "unknownTag", value: [] }, 99],
		])("should return correct order for %#", (input, expected) => {
			expect(getTagOrder(input)).toBe(expected);
		});

		it("should warn for unknown @unit in biblScope", () => {
			const consoleWarnSpy = vi
				.spyOn(console, "warn")
				.mockImplementation(() => {});
			getTagOrder({
				tag: "biblScope",
				attributes: { "@unit": "invalidUnit" },
				value: [],
			});
			expect(consoleWarnSpy).toHaveBeenCalledWith(
				"Unknown @unit for biblScope:",
				{ tag: "biblScope", attributes: { "@unit": "invalidUnit" }, value: [] },
			);
			consoleWarnSpy.mockRestore();
		});
	});

	describe("BiblValue", () => {
		it("should render ordered values", async () => {
			const screen = await render(
				<BiblValue
					data={{
						tag: "bibl",
						value: [
							{ tag: "publisher", value: "Famous Publisher" },
							{
								tag: "title",
								attributes: { "@level": "a" },
								value: "An Interesting Article",
							},
							{
								tag: "title",
								attributes: { "@level": "j" },
								value: "An Interesting Source",
							},
							{
								tag: "date",
								attributes: {
									"@when": "2023",
								},
							},
							{ tag: "author", value: "John Doe" },
							{ tag: "biblScope", attributes: { "@unit": "vol" }, value: "42" },
							{
								tag: "biblScope",
								attributes: { "@unit": "page", "@from": "19" },
								value: "19",
							},
							{
								tag: "biblScope",
								attributes: { "@unit": "page", "@to": "42" },
								value: "42",
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
			expect(screen.container.textContent).toBe(
				"An Interesting Article, John Doe, 2023, An Interesting Source, 42, 19-42, Famous Publisher",
			);
			expect(
				screen.getByText(
					"An Interesting Article, John Doe, 2023, An Interesting Source, 42, 19-42, Famous Publisher",
				),
			).toBeInTheDocument();
		});

		it("should handle empty values gracefully", async () => {
			const screen = await render(
				<BiblValue
					data={{
						tag: "bibl",
						value: undefined,
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
			expect(screen.container.textContent).toBe("");
		});

		it("should handle non-array values gracefully", async () => {
			const screen = await render(
				<BiblValue
					data={{
						tag: "bibl",
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
			expect(screen.container.textContent).toBe("");
		});
	});

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

			expect(screen.getByRole("listitem")).toHaveAttribute(
				"data-bibref-id",
				"bib1",
			);
			expect(screen.getByText("An Interesting Article")).toBeInTheDocument();

			await screen.getByRole("listitem").click();
			screen.debug();
			expect(navigateToBibliographicReferenceRef).toHaveBeenCalledWith("bib1");
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

			expect(screen.getByRole("listitem")).toHaveAttribute(
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

			await screen.getByRole("listitem").click();
			expect(navigateToBibliographicReferenceRef).toHaveBeenCalledWith("bib1");
		});
	});

	it("should warn when bibl contains mixed nested and other content", async () => {
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

	it("should ignore #text tags when processing nested bibl", async () => {
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
							value: "Some text",
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
							value: "Some text",
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
		expect(consoleWarnSpy).not.toHaveBeenCalled();
		expect(screen.getByText("Nested Article 1")).toBeInTheDocument();
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
