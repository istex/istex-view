import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";
import { PersName } from "./PersName";

describe("PersName", () => {
	it("should display forename before surname separated by space", async () => {
		const screen = await render(
			<PersName
				data={{
					tag: "persName",
					value: [
						{
							tag: "surname",
							value: [
								{
									tag: "#text",
									value: "Doe",
								},
							],
						},
						{
							tag: "forename",
							value: [
								{
									tag: "#text",
									value: "John",
								},
							],
						},
					],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		expect(screen.container.textContent).toBe("Doe John");
	});

	it("should add other tags at the end without reordering them", async () => {
		const screen = await render(
			<PersName
				data={{
					tag: "persName",
					value: [
						{
							tag: "roleName",
							value: [
								{
									tag: "#text",
									value: "Editor",
								},
							],
						},
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
							tag: "surname",
							value: [
								{
									tag: "#text",
									value: "Doe",
								},
							],
						},
						{
							tag: "addName",
							value: [
								{
									tag: "#text",
									value: "Additional Name",
								},
							],
						},
					],
				}}
			/>,
			{
				wrapper: ({ children }) => (
					<TagCatalogProvider tagCatalog={bibliographicReferencesTagCatalog}>
						{children}
					</TagCatalogProvider>
				),
			},
		);

		expect(screen.container.textContent).toBe(
			"Doe John Editor Additional Name",
		);
	});
});
