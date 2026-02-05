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

	it("should render raw value if there is a non empty string in the value array", async () => {
		const screen = await render(
			<Affiliation
				data={{
					tag: "affiliation",
					value: [
						{
							tag: "#text",
							value: "Raw affiliation text, ",
						},
						{
							tag: "orgName",
							value: [
								{
									tag: "#text",
									value: "University X",
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
					name: "Raw affiliation text, University X",
				}),
			)
			.toBeInTheDocument();
	});
});
