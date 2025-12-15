import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { ViewerPage } from "./ViewerPage.js";

vi.mock("./useViewerContext", () => {
	return {
		useViewerContext: vi.fn().mockReturnValue({
			document: "<tei>This is a test</tei>",
		}),
	};
});

describe("ViewerPage", () => {
	it("should render Viewer when document is provided", async () => {
		const screen = await render(<ViewerPage />);

		expect(screen.getByText("<tei>This is a test</tei>")).toBeInTheDocument();
	});
});
