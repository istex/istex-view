import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import App from "./App.js";

describe("App", () => {
	it("should render the upload button", async () => {
		const screen = await render(<App />);

		expect(
			screen.getByRole("button", { name: "Select a TEI File to View" }),
		).toBeInTheDocument();
	});

	it("should render the XML document when a file is uploaded", async () => {
		const screen = await render(<App />);

		const file = new File(["<TEI></TEI>"], "example.tei", {
			type: "text/plain",
		});

		const input = screen.getByTestId("file-selector-input");

		await userEvent.upload(input, file);

		await vi.waitFor(() => {
			expect(screen.getByText(/<TEI><\/TEI>/)).toBeInTheDocument();
		});
	});
});
