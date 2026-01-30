import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { Accordion } from "./Accordion";
import {
	DocumentSidePanelContext,
	DocumentSidePanelContextProvider,
} from "./DocumentSidePanelContext";

describe("Accordion", () => {
	it("should render accordion open if sections matching name is true (open)", async () => {
		const { getByText, getByRole } = await render(
			<Accordion name="footnotes" label="Test Label">
				<div>Test Content</div>
			</Accordion>,
			{
				wrapper: ({ children }) => (
					<DocumentSidePanelContext.Provider
						value={{
							state: {
								isOpen: true,
								sections: {
									keywords: true,
									source: true,
									footnotes: true,
								},
							},
							togglePanel: () => {},
							toggleSection: () => {},
							openSection: () => {},
						}}
					>
						{children}
					</DocumentSidePanelContext.Provider>
				),
			},
		);
		expect(getByText("Test Label")).toBeInTheDocument();
		expect(getByRole("button", { name: "Test Label" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);
		expect(getByText("Test Content")).toBeInTheDocument();
		expect(getByText("Test Content")).toBeVisible();
	});
	it("should render accordion closed if sections matching name is false (closed)", async () => {
		const { getByText, getByRole } = await render(
			<Accordion name="footnotes" label="Test Label">
				<div>Test Content</div>
			</Accordion>,
			{
				wrapper: ({ children }) => (
					<DocumentSidePanelContext.Provider
						value={{
							state: {
								isOpen: true,
								sections: {
									keywords: true,
									source: true,
									footnotes: false,
								},
							},
							togglePanel: () => {},
							toggleSection: () => {},
							openSection: () => {},
						}}
					>
						{children}
					</DocumentSidePanelContext.Provider>
				),
			},
		);
		expect(getByText("Test Label")).toBeInTheDocument();
		expect(getByRole("button", { name: "Test Label" })).toHaveAttribute(
			"aria-expanded",
			"false",
		);
		expect(getByText("Test Content")).toBeInTheDocument();
		expect(getByText("Test Content")).not.toBeVisible();
	});

	it("should toggle accordion when clicking on label", async () => {
		const { getByText, getByRole } = await render(
			<Accordion name="footnotes" label="Test Label">
				<div>Test Content</div>
			</Accordion>,
			{
				wrapper: ({ children }) => (
					<DocumentSidePanelContextProvider>
						{children}
					</DocumentSidePanelContextProvider>
				),
			},
		);
		expect(getByText("Test Label")).toBeInTheDocument();
		expect(getByRole("button", { name: "Test Label" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);
		expect(getByText("Test Content")).toBeInTheDocument();
		expect(getByText("Test Content")).toBeVisible();

		await getByRole("button", { name: "Test Label" }).click();
		await new Promise((resolve) => setTimeout(resolve, 300));

		expect(getByRole("button", { name: "Test Label" })).toHaveAttribute(
			"aria-expanded",
			"false",
		);
		expect(getByText("Test Content")).not.toBeVisible();

		await getByRole("button", { name: "Test Label" }).click();
		await new Promise((resolve) => setTimeout(resolve, 300));

		expect(getByRole("button", { name: "Test Label" })).toHaveAttribute(
			"aria-expanded",
			"true",
		);
		expect(getByText("Test Content")).toBeVisible();
	});
});
