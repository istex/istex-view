import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson, DocumentJsonValue } from "../parser/document.js";
import { Head } from "./Head.js";

describe("Head", () => {
	it.each([
		{ depth: 1, content: "Heading 1", expectedDepth: 2 },
		{ depth: 2, content: "Heading 2" },
		{ depth: 3, content: "Heading 3" },
		{ depth: 4, content: "Heading 4" },
		{ depth: 5, content: "Heading 5" },
		{ depth: 6, content: "Heading 6" },
		{ depth: 7, content: "Heading 7", expectedDepth: 6 },
	])("should render head tag ", async ({ depth, content, expectedDepth }) => {
		const jsonValue: DocumentJson = {
			tag: "head",
			attributes: {},
			value: [{ tag: "#text", value: content }],
		};

		const screen = await render(<Head data={jsonValue} depth={depth} />);

		expect(
			screen.getByRole("heading", {
				level: expectedDepth ?? depth,
				name: content,
			}),
		).toBeInTheDocument();
	});

	it("should render head tag with nested <hi> elements", async () => {
		const jsonValue: DocumentJsonValue = {
			tag: "head",
			attributes: {},
			value: [
				{ tag: "#text", value: "This is a " },
				{
					tag: "hi",
					attributes: { rend: "italic" },
					value: [{ tag: "#text", value: "nested" }],
				},
				{ tag: "#text", value: " heading." },
			],
		};

		const screen = await render(<Head data={jsonValue} depth={2} />);

		const heading = screen.getByRole("heading", { level: 2 });
		expect(heading).toBeInTheDocument();
		expect(heading).toHaveTextContent("This is a nested heading.");
	});

	it.each([
		{ value: [] },
		{ value: undefined },
		{ value: "" },
	])("should not render when value is empty", async ({ value }) => {
		const jsonValue: DocumentJsonValue = {
			tag: "head",
			attributes: {},
			value,
		};

		const screen = await render(<Head data={jsonValue} depth={1} />);
		expect(screen.container).toBeEmptyDOMElement();
	});
});
