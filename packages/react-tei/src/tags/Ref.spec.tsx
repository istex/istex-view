import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import type { DocumentJson } from "../parser/document.js";
import { Ref } from "./Ref.js";

describe("Ref", () => {
	it("should render text", async () => {
		const jsonValue: DocumentJson = {
			tag: "ref",
			attributes: {},
			value: [
				{
					tag: "#text",
					attributes: {},
					value: "Hello",
				},
			],
		};

		const screen = await render(<Ref data={jsonValue} />);
		expect(screen.getByText("Hello")).toBeInTheDocument();
	});
});
