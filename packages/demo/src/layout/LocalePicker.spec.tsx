import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { supportedLanguages } from "../i18n/i18n";
import LocalePicker from "./LocalePicker";

describe("LocalePicker", () => {
	it("it displays every supported locale", async () => {
		const screen = await render(<LocalePicker />);

		const select = screen.getByRole("combobox");
		await select.click();

		const options = screen.getByRole("option").all();

		expect(options).toHaveLength(supportedLanguages.length);
		for (let i = 0; i < supportedLanguages.length; i++) {
			expect(options[i]).toHaveAttribute("data-value", supportedLanguages[i]);
		}
	});
});
