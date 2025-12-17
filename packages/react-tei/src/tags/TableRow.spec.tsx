import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import type { DocumentJson } from "../parser/document.js";
import { TableRow } from "./TableRow.js";

describe("TableRow", () => {
	it("should render a table row with cells", async () => {
		const jsonRow: DocumentJson = {
			tag: "row",
			attributes: {},
			value: [
				{
					tag: "cell",
					attributes: { "@rows": "2", "@cols": "1" },
					value: "Cell 1",
				},
				{
					tag: "cell",
					attributes: {},
					value: "Cell 2",
				},
			],
		};

		const screen = await render(<TableRow data={jsonRow} />);

		expect(screen.getByRole("cell", { name: "Cell 1" })).toBeVisible();
		expect(screen.getByRole("cell", { name: "Cell 2" })).toBeVisible();
	});
});
