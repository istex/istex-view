import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { authorTagCatalogs } from "../authorsTagCatalog";
import { Affiliation } from "./Affiliation";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={authorTagCatalogs}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("Affiliation", () => {
	it("should return affiliation parts separarated by a coma", async () => {
		const screen = await render(
			<Affiliation
				data={{
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
								{
									tag: "country",
									value: [
										{
											tag: "#text",
											value: "Wonderland",
										},
									],
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
			.element(
				screen.getByRole("listitem", {
					name: "University X, 123 Main St, Cityville, Wonderland",
				}),
			)
			.toBeInTheDocument();
	});
});
