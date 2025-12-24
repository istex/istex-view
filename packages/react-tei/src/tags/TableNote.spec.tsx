import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import type { DocumentJson } from "../parser/document";
import { TableNotes } from "./TableNotes";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("TableNote", () => {
	it("should render a table-wrap-foot note", async () => {
		const notes: DocumentJson[] = [
			{
				tag: "note",
				attributes: {
					"@type": "table-wrap-foot",
				},
				value: [
					{
						tag: "note",
						attributes: {
							"@type": "inline",
						},
						value: [
							{
								tag: "p",
								attributes: {},
								value: [
									{
										tag: "#text",
										attributes: {},
										value: "This is a foot note inside table-wrap-foot",
									},
								],
							},
						],
					},
				],
			},
		];

		const screen = await render(<TableNotes notes={notes} />, {
			wrapper: TestWrapper,
		});

		const group = screen.getByRole("group");
		expect(group).toBeInTheDocument();

		expect(
			group.getByRole("note").filter({
				hasText: "This is a foot note inside table-wrap-foot",
			}),
		).toBeInTheDocument();
	});

	it("should render a foot note", async () => {
		const notes: DocumentJson[] = [
			{
				tag: "note",
				attributes: {
					"@type": "foot-note",
				},
				value: [
					{
						tag: "label",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "1",
							},
						],
					},
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is foot note 1",
							},
						],
					},
				],
			},
			{
				tag: "note",
				attributes: {
					"@type": "foot-note",
				},
				value: [
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is foot note 2",
							},
						],
					},
				],
			},
		];

		const screen = await render(<TableNotes notes={notes} />, {
			wrapper: TestWrapper,
		});

		expect(
			screen.getByRole("note").filter({
				hasText: "1This is foot note 1",
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("note").filter({
				hasText: "This is foot note 2",
			}),
		).toBeInTheDocument();
	});

	it("should render an inline note", async () => {
		const notes: DocumentJson[] = [
			{
				tag: "note",
				attributes: {
					"@type": "inline",
				},
				value: [
					{
						tag: "#text",
						attributes: {},
						value: "This is an inline note",
					},
				],
			},
		];

		const screen = await render(<TableNotes notes={notes} />, {
			wrapper: TestWrapper,
		});

		const note = screen.getByRole("note");
		expect(note).toBeInTheDocument();
		expect(note).toHaveTextContent("This is an inline note");
	});

	it("should render a legend note", async () => {
		const notes: DocumentJson[] = [
			{
				tag: "note",
				attributes: {
					"@type": "legend",
				},
				value: [
					{
						tag: "#text",
						attributes: {},
						value: "This is a legend note",
					},
				],
			},
		];

		const screen = await render(<TableNotes notes={notes} />, {
			wrapper: TestWrapper,
		});

		const note = screen.getByRole("note");
		expect(note).toBeInTheDocument();
		expect(note).toHaveTextContent("This is a legend note");
	});

	it.each<Record<string, string>>([
		{
			"@type": "other-type",
		},
		{},
	])("should render other note types", async (attributes) => {
		const notes: DocumentJson[] = [
			{
				tag: "note",
				attributes,
				value: [
					{
						tag: "#text",
						attributes: {},
						value: "This is a note with other type",
					},
				],
			},
		];

		const screen = await render(<TableNotes notes={notes} />, {
			wrapper: TestWrapper,
		});

		const note = screen.getByRole("note");
		expect(note).toBeInTheDocument();
		expect(note).toHaveTextContent("This is a note with other type");
	});
});
