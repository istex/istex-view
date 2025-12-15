import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import App from "./App.js";

describe("App", () => {
	it('should render "Hello world"', async () => {
		const screen = await render(<App />);

		expect(screen.getByText("Hello world")).toBeInTheDocument();
	});
});
