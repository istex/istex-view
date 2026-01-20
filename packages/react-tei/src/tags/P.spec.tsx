import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document";
import { groupConsecutiveNonTableValues, P } from "./P";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

// ...existing code...

it("should have a tooltip for InlineFigure inside paragraph if it contains displayable content", async () => {
	const jsonValue: DocumentJson = {
		tag: "p",
		attributes: {},
		value: [
			{ tag: "#text", value: "This is a paragraph with an inline figure: " },
			{
				tag: "figure",
				value: [
					{
						tag: "figDesc",
						attributes: {},
						value: [{ tag: "#text", value: "This is a figure description." }],
					},
				],
			},
			{
				tag: "#text",
				value: ".",
			},
		],
	};

	const screen = await render(<P data={jsonValue} />, {
		wrapper: ({ children }) => (
			<TagCatalogProvider tagCatalog={tagCatalog}>
				{children}
			</TagCatalogProvider>
		),
	});

	const inlineFigure = screen.getByText("figure.unloaded");
	await expect.element(inlineFigure).toBeVisible();

	// Use userEvent.hover from vitest browser context
	await userEvent.hover(inlineFigure.element());

	// Wait for tooltip to appear
	const tooltip = screen.getByRole("tooltip");
	await expect.element(tooltip).toBeVisible();
	await expect
		.element(tooltip)
		.toHaveTextContent("This is a figure description.");
});

describe("groupConsecutiveNonTableValues", () => {
	it("should return a single group when there are no tables", () => {
		const values: DocumentJson[] = [
			{ tag: "#text", value: "This is a paragraph." },
			{
				tag: "hi",
				attributes: { "@rend": "italic" },
				value: [{ tag: "#text", value: " with italic text." }],
			},
		];

		const grouped = groupConsecutiveNonTableValues(values);

		expect(grouped).toEqual([values]);
	});

	it("should group values without table", () => {
		const values: DocumentJson[] = [
			{ tag: "#text", value: "This is a paragraph." },
			{
				tag: "hi",
				attributes: { "@rend": "italic" },
				value: [{ tag: "#text", value: " with italic text." }],
			},
			{
				tag: "table",
				attributes: {},
				value: [],
			},
			{ tag: "#text", value: "This is after the table." },
		];

		const grouped = groupConsecutiveNonTableValues(values);

		expect(grouped).toEqual([
			[
				{ tag: "#text", value: "This is a paragraph." },
				{
					tag: "hi",
					attributes: { "@rend": "italic" },
					value: [{ tag: "#text", value: " with italic text." }],
				},
			],
			[
				{
					tag: "table",
					attributes: {},
					value: [],
				},
			],
			[{ tag: "#text", value: "This is after the table." }],
		]);
	});

	it("should group values when table is the last element", () => {
		const values: DocumentJson[] = [
			{ tag: "#text", value: "This is a paragraph." },
			{
				tag: "hi",
				attributes: { "@rend": "italic" },
				value: [{ tag: "#text", value: " with italic text." }],
			},
			{
				tag: "table",
				attributes: {},
				value: [],
			},
		];

		const grouped = groupConsecutiveNonTableValues(values);

		expect(grouped).toEqual([
			[
				{ tag: "#text", value: "This is a paragraph." },
				{
					tag: "hi",
					attributes: { "@rend": "italic" },
					value: [{ tag: "#text", value: " with italic text." }],
				},
			],
			[
				{
					tag: "table",
					attributes: {},
					value: [],
				},
			],
		]);
	});

	it("should not group consecutive tables together", () => {
		const values: DocumentJson[] = [
			{
				tag: "table",
				attributes: { "@xml:id": "table1" },
				value: [],
			},
			{
				tag: "table",
				attributes: { "@xml:id": "table2" },
				value: [],
			},
			{ tag: "#text", value: "Text after tables." },
		];

		const grouped = groupConsecutiveNonTableValues(values);

		expect(grouped).toEqual([
			[
				{
					tag: "table",
					attributes: { "@xml:id": "table1" },
					value: [],
				},
			],
			[
				{
					tag: "table",
					attributes: { "@xml:id": "table2" },
					value: [],
				},
			],
			[{ tag: "#text", value: "Text after tables." }],
		]);
	});
});

describe("P", () => {
	it("should render paragraph tag with text content", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a paragraph" },
				{
					tag: "hi",
					attributes: { "@rend": "italic" },
					value: [{ tag: "#text", value: " with italic text" }],
				},
				{
					tag: "#text",
					value: ".",
				},
			],
		};

		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.getByRole("paragraph"))
			.toHaveTextContent("This is a paragraph with italic text.");
	});

	it("should render paragraph tag with multiple <hi> tags formatted", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a paragraph with " },
				{
					tag: "hi",
					attributes: { "@rend": "italic" },
					value: [{ tag: "#text", value: "italic text" }],
				},
				{ tag: "#text", value: " and " },
				{
					tag: "hi",
					attributes: { "@rend": "bold" },
					value: [{ tag: "#text", value: "bold text" }],
				},
				{
					tag: "#text",
					value: ".",
				},
			],
		};

		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.getByRole("paragraph"))
			.toHaveTextContent("This is a paragraph with italic text and bold text.");

		await expect
			.element(screen.container.querySelector("em"))
			.toHaveTextContent("italic text", {
				normalizeWhitespace: true,
			});
		await expect
			.element(screen.container.querySelector("strong"))
			.toHaveTextContent("bold text", {
				normalizeWhitespace: true,
			});
	});

	it("should render a table when it is inside a paragraph", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{
					tag: "table",
					attributes: {
						"@xml:id": "test",
					},
					value: [],
				},
			],
		};
		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect.element(screen.getByRole("table")).toBeInTheDocument();
		await expect
			.element(screen.getByRole("table"))
			.toHaveAttribute("id", "table-test");

		await expect.element(screen.getByRole("paragraph")).not.toBeInTheDocument();
	});

	it("should render a table with content before", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "Text before table." },
				{
					tag: "table",
					attributes: {
						"@xml:id": "test",
					},
					value: [],
				},
			],
		};
		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.getByRole("paragraph"))
			.toHaveTextContent("Text before table.");

		await expect.element(screen.getByRole("table")).toBeInTheDocument();
		await expect
			.element(screen.getByRole("table"))
			.toHaveAttribute("id", "table-test");
	});

	it("should not render empty text nodes inside paragraph", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "\n   " },
				{
					tag: "hi",
					attributes: { "@rend": "italic" },
					value: [{ tag: "#text", value: "Valid text" }],
				},
				{ tag: "#text", value: "" },
			],
		};
		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		await expect
			.element(screen.getByRole("paragraph"))
			.toHaveTextContent("Valid text");
	});

	it("should interpret nested p as NoOp and not create nested <p> tags", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a paragraph with " },
				{
					tag: "p",
					attributes: {},
					value: [{ tag: "#text", value: "nested p tag" }],
				},
				{
					tag: "#text",
					value: ".",
				},
			],
		};

		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByRole("paragraph")).toHaveTextContent(
			"This is a paragraph with nested p tag.",
		);
	});

	it("should render figure with image as InlineFigure inside paragraph", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a paragraph with an inline figure: " },
				{
					tag: "figure",
					value: [
						{
							tag: "graphic",
						},
					],
				},
				{
					tag: "#text",
					value: ".",
				},
			],
		};

		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(screen.getByRole("paragraph")).toHaveTextContent(
			"This is a paragraph with an inline figure: figure.unloaded.",
		);
	});

	it("should have a tooltip for InlineFigure inside paragraph if it contains displayable content", async () => {
		const jsonValue: DocumentJson = {
			tag: "p",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a paragraph with an inline figure: " },
				{
					tag: "figure",
					value: [
						{
							tag: "figDesc",
							attributes: {},
							value: [{ tag: "#text", value: "This is a figure description." }],
						},
					],
				},
				{
					tag: "#text",
					value: ".",
				},
			],
		};
		userEvent.setup();

		const screen = await render(<P data={jsonValue} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		const inlineFigure = screen.getByText("figure.unloaded");
		expect(inlineFigure).toBeVisible();

		await userEvent.hover(inlineFigure.element());

		const tooltip = screen.getByRole("tooltip");
		expect(tooltip).toBeVisible();
		expect(tooltip).toHaveTextContent("This is a figure description.");
	});
});
