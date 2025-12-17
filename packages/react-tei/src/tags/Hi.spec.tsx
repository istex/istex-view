import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document.js";
import { Hi } from "./Hi.js";

describe("Hi", () => {
	it("should render text", async () => {
		const jsonValue: DocumentJson = {
			tag: "hi",
			attributes: {},
			value: [
				{
					tag: "#text",
					attributes: {},
					value: "Hello",
				},
			],
		};

		const screen = await render(<Hi data={jsonValue} />);
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});
});
