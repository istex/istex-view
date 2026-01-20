import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import { Highlight } from "./Highlight";
import { TagCatalogContext } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<DocumentContextProvider
			jsonDocument={[]}
			jsonUnitexEnrichment={{
				persName: [
					{ term: "Albert Einstein", displayed: true },
					{ term: "Einstein", displayed: true },
					{ term: "Nancy", displayed: true },
				],
				placeName: [
					{
						term: "London",
						displayed: false,
					},
					{ term: "Nancy", displayed: false },
					{
						term: "Université Albert Einstein",
						displayed: true,
					},
					{
						term: "Université Einstein",
						displayed: false,
					},
				],
			}}
		>
			<TagCatalogContext value={tagCatalog}>{children}</TagCatalogContext>
		</DocumentContextProvider>
	);
}

describe("Highlight", () => {
	it("should render term as highlighted if group is displayed", async () => {
		const screen = await render(
			<Highlight
				data={{
					tag: "highlight",
					attributes: { groups: "persName", term: "einstein" },
					value: "Einstein",
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const element = screen.getByRole("mark");

		await expect.element(element).toBeInTheDocument();
		await expect.element(element).toHaveTextContent("Einstein");
		await expect.element(element).toHaveAttribute("data-term", "einstein");
		await expect.element(element).toHaveAttribute("data-group", "persName");
	});

	it("should not render term as highlighted if no group is displayed", async () => {
		const screen = await render(
			<Highlight
				data={{
					tag: "highlight",
					attributes: { groups: ["placeName"], term: "london" },
					value: "London",
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		await expect.element(screen.getByText("London")).toBeInTheDocument();
		await expect.element(screen.getByRole("mark")).not.toBeInTheDocument();
	});

	it("should only render displayed groups as under underlined groups", async () => {
		const screen = await render(
			<Highlight
				data={{
					tag: "highlight",
					attributes: { groups: ["persName", "placeName"], term: "nancy" },
					value: "Nancy",
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const element = screen.getByRole("mark");
		await expect.element(element).toBeInTheDocument();
		await expect.element(element).toHaveTextContent("Nancy");
		await expect.element(element).toHaveAttribute("data-term", "nancy");
		await expect
			.element(element)
			.toHaveAttribute("data-group", "persName placeName");
		await expect
			.element(element)
			.toHaveAttribute("data-underlined-group", "persName");
	});

	it("should support nested highlights", async () => {
		const screen = await render(
			<Highlight
				data={{
					tag: "highlight",
					attributes: { groups: "persName", term: "albert-einstein" },
					value: [
						{
							tag: "#text",
							value: "Albert ",
						},
						{
							tag: "highlight",
							attributes: { groups: "persName", term: "einstein" },
							value: "Einstein",
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const outerElement = screen.getByRole("mark").filter({
			hasText: "Albert Einstein",
			exact: true,
		});
		await expect.element(outerElement).toBeInTheDocument();
		await expect.element(outerElement).toHaveTextContent("Albert Einstein");
		await expect
			.element(outerElement)
			.toHaveAttribute("data-term", "albert-einstein");
		await expect
			.element(outerElement)
			.toHaveAttribute("data-group", "persName");

		const innerElement = screen.getByText("Einstein", { exact: true });
		await expect.element(innerElement).toBeInTheDocument();
		await expect.element(innerElement).toHaveAttribute("data-term", "einstein");
		await expect
			.element(innerElement)
			.toHaveAttribute("data-underlined-group", "persName");
	});

	it("should not render outer highlight if hidden, but should render children", async () => {
		const screen = await render(
			<Highlight
				data={{
					tag: "highlight",
					attributes: {
						groups: "placeName",
						term: "université-einstein",
					},
					value: [
						{
							tag: "highlight",
							attributes: {
								groups: "placeName",
								term: "université-einstein",
							},
							value: "Université ",
						},
						{
							tag: "highlight",
							attributes: {
								groups: "placeName persName",
								term: "einstein",
							},
							value: "Einstein",
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);
		const outerElement = screen.getByRole("mark").filter({
			hasText: "Université Albert Einstein",
			exact: true,
		});
		await expect.element(outerElement).not.toBeInTheDocument();
		await expect
			.element(screen.getByText("Université ", { exact: true }))
			.not.toBeInTheDocument();

		const innerElement = screen.getByText("Einstein", { exact: true });
		await expect.element(innerElement).toBeInTheDocument();
		await expect.element(innerElement).toHaveAttribute("data-term", "einstein");
		await expect
			.element(innerElement)
			.toHaveAttribute("data-group", "placeName persName");
		await expect
			.element(innerElement)
			.toHaveAttribute("data-underlined-group", "persName");
	});

	it("should only render outer group if a child highlight is the same game and term", async () => {
		const screen = await render(
			<Highlight
				data={{
					tag: "highlight",
					attributes: {
						groups: "placeName",
						term: "université-albert-einstein",
					},
					value: [
						{
							tag: "highlight",
							attributes: {
								groups: "placeName",
								term: "université-albert-einstein",
							},
							value: "Université ",
						},
						{
							tag: "highlight",
							attributes: {
								groups: "placeName persName",
								term: "albert-einstein",
							},
							value: "Albert Einstein",
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const outerElement = screen.getByRole("mark").filter({
			hasText: "Université Albert Einstein",
			exact: true,
		});
		await expect.element(outerElement).toBeInTheDocument();
		await expect
			.element(outerElement)
			.toHaveTextContent("Université Albert Einstein");
		await expect
			.element(outerElement)
			.toHaveAttribute("data-term", "université-albert-einstein");
		await expect
			.element(outerElement)
			.toHaveAttribute("data-group", "placeName");

		const innerElement = screen.getByText("Albert Einstein", { exact: true });
		await expect.element(innerElement).toBeInTheDocument();
		await expect
			.element(innerElement)
			.toHaveAttribute("data-term", "albert-einstein");
		await expect
			.element(innerElement)
			.toHaveAttribute("data-group", "placeName persName");
		await expect
			.element(innerElement)
			.toHaveAttribute("data-underlined-group", "placeName persName");

		// We should not have a separate highlight for "Université "
		// So we check that the matched element is the outer mark
		await expect
			.element(screen.getByText("Université"))
			.toHaveTextContent("Université Albert Einstein");
	});
});
