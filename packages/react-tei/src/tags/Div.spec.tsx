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

		expect(container.querySelector("div > p")?.textContent).toBe("Paragraph 1");
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

		expect(container.querySelector("section > h2")?.textContent).toBe(
			"Header content",
		);
		expect(container.querySelector("section > p")?.textContent).toBe(
			"Paragraph 1",
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

		expect(container.querySelector(":scope > section > h2")?.textContent).toBe(
			"Outer Header",
		);
		expect(
			container.querySelector(":scope > section > section > h3")?.textContent,
		).toBe("Inner Header");
		expect(
			container.querySelector(":scope > section > section > p")?.textContent,
		).toBe("Inner Paragraph");
		expect(
			container.querySelector(":scope > section > section > div > p")
				?.textContent,
		).toBe("Deeper Paragraph");
		expect(container.querySelector(":scope > section > p")?.textContent).toBe(
			"Outer Paragraph",
		);
	});

	it("should warn and render nothing for non-array value", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});

		const screen = await render(
			<Div
				data={{
					tag: "div",
					value: "This is a string, not an array",
				}}
			/>,
		);

		expect(
			screen.getByText("This is a string, not an array"),
		).not.toBeInTheDocument();

		expect(screen.container.querySelectorAll("div")).toHaveLength(0);
		expect(screen.container.querySelectorAll("section")).toHaveLength(0);

		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Div tag with non-array value:",
			"This is a string, not an array",
		);

		consoleWarnSpy.mockRestore();
	});

	it("should add aria-labelledby to section based on head when present", async () => {
		const { getByLabelText, getByText } = await render(
			<Div
				data={{
					tag: "div",
					value: [
						{
							tag: "div",
							value: [
								{ tag: "head", value: "Section Header 1" },
								{ tag: "p", value: "Some paragraph 1." },
							],
						},
						{
							tag: "div",
							value: [
								{ tag: "head", value: "Section Header 2" },
								{ tag: "p", value: "Some paragraph 2." },
							],
						},
					],
				}}
			/>,
		);

		const section1 = getByLabelText("Section Header 1");
		const section2 = getByLabelText("Section Header 2");

		const head1 = getByText("Section Header 1");
		const head2 = getByText("Section Header 2");

		const p1 = getByText("Some paragraph 1.");
		const p2 = getByText("Some paragraph 2.");

		expect(section1).toBeInTheDocument();

		expect(section1).toContainElement(head1);
		expect(section1).toContainElement(p1);

		expect(section2).toBeInTheDocument();

		expect(section2).toContainElement(head2);
		expect(section2).toContainElement(p2);
	});
});
