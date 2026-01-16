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
					{ term: "Paris", displayed: true, frequency: 1 },
					{ term: "Einstein", displayed: true, frequency: 2 },
					{ term: "Nancy", displayed: true, frequency: 5 },
				],
				placeName: [
					{ term: "Paris", displayed: true, frequency: 1 },
					{
						term: "London",
						displayed: false,
						frequency: 3,
					},
					{ term: "Nancy", displayed: false, frequency: 5 },
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

	it("should only render displayed groups", async () => {
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
		await expect.element(element).toHaveAttribute("data-group", "persName");
	});
});
