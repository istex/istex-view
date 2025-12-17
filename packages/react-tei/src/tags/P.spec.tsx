import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document.js";
import { P } from "./P.js";

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
});
