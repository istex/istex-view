import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { authorTagCatalogs } from "../authorsTagCatalog";
import { Author } from "./Author";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={authorTagCatalogs}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("Author", () => {
	it("should render author name and affiliations", async () => {
		const screen = await render(
			<Author
				data={{
					tag: "author",
					value: [
						{
							tag: "forename",
							value: [{ tag: "#text", value: "John" }],
						},
						{
							tag: "surname",
							value: [{ tag: "#text", value: "Doe" }],
						},
						{
							tag: "affiliation",
							value: [
								{
									tag: "orgName",
									value: [{ tag: "#text", value: "University A" }],
								},
							],
						},
						{
							tag: "affiliation",
							value: [
								{
									tag: "orgName",
									value: [{ tag: "#text", value: "Institute B" }],
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
		await expect
			.element(screen.getByRole("listitem", { name: "Auteur" }))
			.toBeInTheDocument();
		await expect.element(screen.getByText("John Doe")).toBeInTheDocument();
		await expect
			.element(screen.getByRole("listitem", { name: "University A" }))
			.toBeInTheDocument();
		await expect
			.element(screen.getByRole("listitem", { name: "Institute B" }))
			.toBeInTheDocument();
	});

	it('should render "et al." for authors with role="et-al"', async () => {
		const screen = await render(
			<Author
				data={{
					tag: "author",
					attributes: { "@role": "et-al" },
					value: [
						{
							tag: "#text",
							value: "et al.",
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);
		await expect.element(screen.getByText("et al.")).toBeInTheDocument();
	});
});
