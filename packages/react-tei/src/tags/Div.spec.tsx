import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { Div } from "./Div.js";

describe("Div", () => {
	it("should render it's value in a div when there is no head tag", async () => {
		const { container } = await render(
			<Div
				data={{
					tag: "div",
					value: [
						{ tag: "p", value: "Paragraph 1" },
						{ tag: "p", value: "Paragraph 2" },
					],
				}}
			/>,
		);

		expect(container.querySelectorAll("section")).toHaveLength(0);
		expect(container.querySelectorAll("div")).toHaveLength(1);
		expect(container.querySelectorAll("p")).toHaveLength(2);

		expect(container.innerHTML).toBe(
			'<div class="MuiBox-root css-0">' +
				'<p class="MuiTypography-root MuiTypography-body1 css-rizt0-MuiTypography-root">' +
				"Paragraph 1" +
				"</p>" +
				'<p class="MuiTypography-root MuiTypography-body1 css-rizt0-MuiTypography-root">' +
				"Paragraph 2" +
				"</p>" +
				"</div>",
		);
	});

	it("should render its value in a section when there is a head tag", async () => {
		const { container } = await render(
			<Div
				data={{
					tag: "div",
					value: [
						{ tag: "head", value: "Header content" },
						{ tag: "p", value: "Paragraph 1" },
					],
				}}
			/>,
		);
		expect(container.querySelectorAll("section")).toHaveLength(1);
		expect(container.querySelectorAll("h2")).toHaveLength(1);
		expect(container.querySelectorAll("p")).toHaveLength(1);
		expect(container.querySelectorAll("div")).toHaveLength(0);

		expect(container.innerHTML).toBe(
			'<section class="MuiBox-root css-11v9m8c">' +
				"<h2>" +
				"Header content" +
				"</h2>" +
				'<p class="MuiTypography-root MuiTypography-body1 css-rizt0-MuiTypography-root">' +
				"Paragraph 1" +
				"</p>" +
				"</section>",
		);
	});

	it("should handle nested divs correctly", async () => {
		const { container } = await render(
			<Div
				data={{
					tag: "div",
					value: [
						{ tag: "head", value: "Outer Header" },
						{
							tag: "div",
							value: [
								{ tag: "head", value: "Inner Header" },
								{ tag: "p", value: "Inner Paragraph" },
								{
									tag: "div",
									value: [{ tag: "p", value: "Deeper Paragraph" }],
								},
							],
						},
						{ tag: "p", value: "Outer Paragraph" },
					],
				}}
			/>,
		);

		expect(container.querySelectorAll("section")).toHaveLength(2);
		expect(container.querySelectorAll("h2")).toHaveLength(1);
		expect(container.querySelectorAll("h3")).toHaveLength(1);
		expect(container.querySelectorAll("p")).toHaveLength(3);
		expect(container.querySelectorAll("div")).toHaveLength(1);

		expect(container.innerHTML).toBe(
			'<section class="MuiBox-root css-11v9m8c">' +
				"<h2>" +
				"Outer Header" +
				"</h2>" +
				'<section class="MuiBox-root css-11v9m8c">' +
				"<h3>" +
				"Inner Header" +
				"</h3>" +
				'<p class="MuiTypography-root MuiTypography-body1 css-rizt0-MuiTypography-root">' +
				"Inner Paragraph" +
				"</p>" +
				'<div class="MuiBox-root css-0">' +
				'<p class="MuiTypography-root MuiTypography-body1 css-rizt0-MuiTypography-root">' +
				"Deeper Paragraph" +
				"</p>" +
				"</div>" +
				"</section>" +
				'<p class="MuiTypography-root MuiTypography-body1 css-rizt0-MuiTypography-root">' +
				"Outer Paragraph" +
				"</p>" +
				"</section>",
		);
	});

	it("should warn and render nothing for non-array value", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const { container } = await render(
			<Div
				data={{
					tag: "div",
					value: "This is a string, not an array",
				}}
			/>,
		);

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Div tag with non-array value:",
			"This is a string, not an array",
		);
		expect(container.innerHTML).toBe("");

		consoleWarnSpy.mockRestore();
	});
});
