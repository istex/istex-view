import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentTitle } from "./DocumentTitle.js";
import type { DocumentJson } from "./parser/document.js";

describe("DocumentTitle", () => {
	it("should render document title", async () => {
		const jsonValue: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "fileDesc",
					attributes: {},
					value: [
						{
							tag: "titleStmt",
							attributes: {},
							value: [
								{
									tag: "title",
									attributes: {},
									value: [{ tag: "#text", value: "Sample Document Title" }],
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(<DocumentTitle data={jsonValue} />);

		expect(
			screen.getByRole("heading", { level: 1, name: "Sample Document Title" }),
		).toBeInTheDocument();
	});

	it("should render document title with complex value", async () => {
		const jsonValue: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "fileDesc",
					attributes: {},
					value: [
						{
							tag: "titleStmt",
							attributes: {},
							value: [
								{
									tag: "title",
									attributes: {},
									value: [
										{ tag: "#text", value: "Sample " },
										{
											tag: "hi",
											attributes: { rend: "italic" },
											value: [{ tag: "#text", value: "TEI" }],
										},
										{ tag: "#text", value: " File" },
									],
								},
							],
						},
					],
				},
			],
		};

		const screen = await render(<DocumentTitle data={jsonValue} />);

		expect(
			screen.getByRole("heading", { level: 1, name: "Sample TEI File" }),
		).toBeInTheDocument();
	});

	it("should not render when title is missing", async () => {
		const jsonValue: DocumentJson = {
			tag: "teiHeader",
			attributes: {},
			value: [
				{
					tag: "fileDesc",
					attributes: {},
					value: [],
				},
			],
		};

		const screen = await render(<DocumentTitle data={jsonValue} />);

		expect(screen.container).toBeEmptyDOMElement();
	});
});
