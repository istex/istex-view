import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import { useViewerContext } from "../viewer/useViewerContext.js";
import { UploadPage } from "./UploadPage.js";

vi.mock("../viewer/useViewerContext");

describe("UploadPage", () => {
	it("should display a file picker", async () => {
		const openDocument = vi.fn();
		const closeDocument = vi.fn();
		vi.mocked(useViewerContext).mockReturnValue({
			document: null,
			openDocument,
			closeDocument,
		});

		const screen = await render(<UploadPage />);

		expect(
			screen.getByRole("button", {
				name: "Select a TEI File to View",
			}),
		).toBeInTheDocument();

		expect(openDocument).not.toHaveBeenCalled();
		expect(closeDocument).not.toHaveBeenCalled();
	});

	it("should call openDocument when a file is selected", async () => {
		const openDocument = vi.fn();
		const closeDocument = vi.fn();
		vi.mocked(useViewerContext).mockReturnValue({
			document: null,
			openDocument,
			closeDocument,
		});

		const screen = await render(<UploadPage />);

		const file = new File(["<TEI></TEI>"], "example.tei", {
			type: "text/plain",
		});

		const input = screen.getByTestId("file-selector-input");

		await userEvent.upload(input, file);

		await vi.waitFor(() => {
			expect(openDocument).toHaveBeenCalledWith(
				expect.stringContaining("<TEI></TEI>"),
			);
		});
	});
});
