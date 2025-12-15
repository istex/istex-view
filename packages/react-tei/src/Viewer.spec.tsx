import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Viewer } from "./Viewer.js";

describe("Viewer", () => {
	it("should display the document as text", async () => {
		const screen = await render(
			<Viewer document="<tei>This is a test</tei>" />,
		);

		expect(screen.getByText("<tei>This is a test</tei>")).toBeInTheDocument();
	});
});
