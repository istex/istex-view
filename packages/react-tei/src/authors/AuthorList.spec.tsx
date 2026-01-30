import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import { TagCatalogProvider } from "../tags/TagCatalogProvider";
import { AuthorList } from "./AuthorList";
import { authorTagCatalogs } from "./authorsTagCatalog";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={authorTagCatalogs}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("AuthorList", () => {
	it("should renders authors with affiliation if present", async () => {
		const screen = await render(
			<AuthorList
				authors={[
					{
						tag: "author",
						value: [
							{
								tag: "forename",
								value: [
									{
										tag: "#text",
										value: "John",
									},
								],
							},
							{
								tag: "#text",
								value: " ",
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
					},
					{
						tag: "author",
						value: [
							{
								tag: "forename",
								value: [
									{
										tag: "#text",
										value: "Jane",
									},
								],
							},
							{
								tag: "#text",
								value: " ",
							},
							{
								tag: "surname",
								value: [
									{
										tag: "#text",
										value: "Smith",
									},
								],
							},
							{
								tag: "affiliation",
								value: [
									{
										tag: "orgName",
										value: [
											{
												tag: "#text",
												value: "University X",
											},
										],
									},
									{
										tag: "address",
										value: [
											{
												tag: "addrLine",
												value: [
													{
														tag: "#text",
														value: "123 Main St, Cityville",
													},
												],
											},
										],
									},
								],
							},
						],
					},
				]}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		await expect
			.element(screen.getByRole("listitem", { name: "Auteur" }))
			.toHaveLength(2);

		await expect.element(screen.getByText("John Doe")).toBeInTheDocument();
		await expect.element(screen.getByText("Jane Smith")).toBeInTheDocument();

		await expect
			.element(
				screen.getByRole("listitem", {
					name: "University X, 123 Main St, Cityville",
				}),
			)
			.toBeInTheDocument();
	});

	it('should render et al. for authors"', async () => {
		const screen = await render(
			<AuthorList
				authors={[
					{
						tag: "author",
						attributes: { "@role": "et-al" },
						value: [
							{
								tag: "#text",
								value: "et al.",
							},
						],
					},
				]}
			/>,
			{
				wrapper: TestWrapper,
			},
		);
		await expect.element(screen.getByText("et al.")).toBeInTheDocument();
	});

	it("should not render anything for empty authors array", async () => {
		const screen = await render(<AuthorList authors={[]} />, {
			wrapper: TestWrapper,
		});
		await expect.element(screen.container).toBeEmptyDOMElement();
	});
});
