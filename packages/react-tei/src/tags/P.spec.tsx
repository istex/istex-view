import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document.js";
import { groupValuesWitoutTable, P } from "./P.js";

describe("groupValuesWitoutTable", () => {
	it("should return a single group when there are no tables", () => {
		const values: DocumentJson[] = [
			{ tag: "#text", value: "This is a paragraph." },
			{
				tag: "hi",
				attributes: { rend: "italic" },
				value: [{ tag: "#text", value: " with italic text." }],
			},
		];

		const grouped = groupValuesWitoutTable(values);

		expect(grouped).toEqual([values]);
	});

	it("should group values without table", () => {
		const values: DocumentJson[] = [
			{ tag: "#text", value: "This is a paragraph." },
			{
				tag: "hi",
				attributes: { rend: "italic" },
				value: [{ tag: "#text", value: " with italic text." }],
			},
			{
				tag: "table",
				attributes: {},
				value: [],
			},
			{ tag: "#text", value: "This is after the table." },
		];

		const grouped = groupValuesWitoutTable(values);

		expect(grouped).toEqual([
			[
				{ tag: "#text", value: "This is a paragraph." },
				{
					tag: "hi",
					attributes: { rend: "italic" },
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
				attributes: { rend: "italic" },
				value: [{ tag: "#text", value: " with italic text." }],
			},
			{
				tag: "table",
				attributes: {},
				value: [],
			},
		];

		const grouped = groupValuesWitoutTable(values);

		expect(grouped).toEqual([
			[
				{ tag: "#text", value: "This is a paragraph." },
				{
					tag: "hi",
					attributes: { rend: "italic" },
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

	it("should ignore empty text nodes", () => {
		const values: DocumentJson[] = [
			{ tag: "#text", value: "This is a paragraph." },
			{ tag: "#text", value: "   " },
			{
				tag: "hi",
				attributes: { rend: "italic" },
				value: [{ tag: "#text", value: " with italic text." }],
			},
			{ tag: "#text", value: "" },
		];

		const grouped = groupValuesWitoutTable(values);

		expect(grouped).toEqual([
			[
				{ tag: "#text", value: "This is a paragraph." },
				{
					tag: "hi",
					attributes: { rend: "italic" },
					value: [{ tag: "#text", value: " with italic text." }],
				},
			],
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
					attributes: { rend: "italic" },
					value: [{ tag: "#text", value: " with italic text" }],
				},
				{
					tag: "#text",
					value: ".",
				},
			],
		};

		const screen = await render(<P data={jsonValue} />);

		expect(screen.getByRole("paragraph")).toHaveTextContent(
			"This is a paragraph with italic text.",
		);
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
		const screen = await render(<P data={jsonValue} />);

		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByRole("table")).toHaveAttribute("id", "table_test");

		expect(screen.getByRole("paragraph")).not.toBeInTheDocument();
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
		const screen = await render(<P data={jsonValue} />);

		expect(screen.getByRole("paragraph")).toHaveTextContent(
			"Text before table.",
		);

		expect(screen.getByRole("table")).toBeInTheDocument();
		expect(screen.getByRole("table")).toHaveAttribute("id", "table_test");
	});
});
