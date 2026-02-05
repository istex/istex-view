import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { authorTagCatalogs } from "../authorsTagCatalog";
import { PersName } from "./PersName";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={authorTagCatalogs}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("PersName", () => {
	it("should render the person names", async () => {
		const screen = await render(
			<PersName
				data={{
					tag: "persName",
					value: [
						{
							tag: "forename",
							attributes: {
								"@type": "first",
							},
							value: [
								{
									tag: "#text",
									value: "John",
								},
							],
						},
						{
							tag: "surname",
							value: [
								{
									tag: "#text",
									value: "Doe",
								},
							],
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		await expect.element(screen.getByText("John")).toBeInTheDocument();
		await expect.element(screen.getByText("Doe")).toBeInTheDocument();
	});

	it('should not render forename if type is not "first"', async () => {
		const screen = await render(
			<PersName
				data={{
					tag: "persName",
					value: [
						{
							tag: "forename",
							attributes: {
								"@type": "middle",
							},
							value: [
								{
									tag: "#text",
									value: "John",
								},
							],
						},
						{
							tag: "surname",
							value: [
								{
									tag: "#text",
									value: "Doe",
								},
							],
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		await expect.element(screen.getByText("John")).not.toBeInTheDocument();
		await expect.element(screen.getByText("Doe")).toBeInTheDocument();
	});
});
