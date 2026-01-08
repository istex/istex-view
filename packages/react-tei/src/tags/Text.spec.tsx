import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import { Text } from "./Text";

describe("Text", () => {
	it("should render text with highlighted terms", async () => {
		const screen = await render(
			<Text
				data={{
					tag: "#text",
					value: "The doctor John Doe lives in Paris capital of France.",
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<DocumentContextProvider
						jsonDocument={[]}
						jsonUnitexEnrichment={{
							person: [
								{ term: "John Doe", frequency: 5, displayed: true },
								{ term: "Jane Smith", frequency: 6, displayed: true },
							],
							place: [
								{ term: "Nancy", frequency: 3, displayed: true },
								{ term: "Paris", frequency: 4, displayed: true },
							],
						}}
					>
						{children}
					</DocumentContextProvider>
				),
			},
		);

		expect(screen.container.textContent).toBe(
			"The doctor John Doe lives in Paris capital of France.",
		);

		expect(screen.getByText("The doctor ")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toBeInTheDocument();
		expect(screen.getByText("John Doe")).toHaveAttribute(
			"class",
			"highlight-person",
		);
		expect(screen.getByText("John Doe")).toHaveAttribute(
			"data-term-id",
			"term-john-doe",
		);
		expect(screen.getByText(" lives in ")).toBeInTheDocument();
		expect(screen.getByText("Paris")).toBeInTheDocument();
		expect(screen.getByText("Paris")).toHaveAttribute(
			"class",
			"highlight-place",
		);
		expect(screen.getByText("Paris")).toHaveAttribute(
			"data-term-id",
			"term-paris",
		);
		expect(screen.getByText(" capital of France.")).toBeInTheDocument();
	});

	it("should render warning when text value is not a string", async () => {
		const consoleWarnSpy = vi
			.spyOn(console, "warn")
			.mockImplementation(() => {});
		const screen = await render(
			<Text
				data={{
					tag: "#text",
					value: [],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<DocumentContextProvider jsonDocument={[]}>
						{children}
					</DocumentContextProvider>
				),
			},
		);

		expect(screen.container.textContent).toBe("");
		expect(consoleWarnSpy).toHaveBeenCalledWith(
			"Text tag does not contain string value",
			{
				tag: "#text",
				value: [],
			},
		);

		consoleWarnSpy.mockRestore();
	});
});
