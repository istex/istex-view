import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";
import {
	FileSelectorButton,
	type FileSelectorButtonProps,
} from "./FileSelectorButton.js";

describe("FileSelectorButton", () => {
	it("should display a file picker", async () => {
		const onChange = vi.fn<FileSelectorButtonProps["onChange"]>();
		const screen = await render(<FileSelectorButton onChange={onChange} />);

		expect(
			screen.getByRole("button", {
				name: "Select a TEI File to View",
			}),
		).toBeInTheDocument();
	});

	it("should call onChange when a file is selected", async () => {
		const onChange = vi.fn<FileSelectorButtonProps["onChange"]>();
		const screen = await render(<FileSelectorButton onChange={onChange} />);

		const file = new File(["<TEI></TEI>"], "example.tei", {
			type: "application/xml",
		});

		const input = screen.getByTestId("file-selector-input");

		await userEvent.upload(input, file);

		expect(onChange).toHaveBeenCalledWith(file);
	});
});
