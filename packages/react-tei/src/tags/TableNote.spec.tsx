import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { DocumentJson } from "../parser/document.js";
import { TableNotes } from "./TableNotes.js";
import { TagCatalogProvider } from "./TagCatalogProvider.js";
import { tagCatalog } from "./tagCatalog.js";

describe("TableNotes", () => {
	it("should render a list of notes", async () => {
		const notes: DocumentJson[] = [
			{
				tag: "note",
				attributes: {},
				value: [
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is note 1",
							},
						],
					},
				],
			},
			{
				tag: "note",
				attributes: {},
				value: [
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is note 2",
							},
						],
					},
				],
			},
		];

		const screen = await render(<TableNotes notes={notes} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(
			screen.getByRole("paragraph").filter({
				hasText: "This is note 1",
			}),
		).toBeInTheDocument();
		expect(
			screen.getByRole("paragraph").filter({
				hasText: "This is note 2",
			}),
		).toBeInTheDocument();
	});

	it("should render a note with complex text content", async () => {
		const notes: DocumentJson[] = [
			{
				tag: "note",
				attributes: {},
				value: [
					{
						tag: "p",
						attributes: {},
						value: [
							{
								tag: "#text",
								attributes: {},
								value: "This is note with ",
							},
							{
								tag: "hi",
								attributes: { "@rend": "italic" },
								value: [
									{
										tag: "#text",
										attributes: {},
										value: "italic text",
									},
								],
							},
							{
								tag: "#text",
								attributes: {},
								value: ".",
							},
						],
					},
				],
			},
		];

		const screen = await render(<TableNotes notes={notes} />, {
			wrapper: ({ children }) => (
				<TagCatalogProvider tagCatalog={tagCatalog}>
					{children}
				</TagCatalogProvider>
			),
		});

		expect(
			screen.getByRole("paragraph").filter({
				hasText: "This is note with italic text.",
			}),
		).toBeInTheDocument();
	});
});
