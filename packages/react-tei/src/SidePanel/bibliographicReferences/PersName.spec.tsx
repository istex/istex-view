import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { bibliographicReferencesTagCatalog } from "./bibliographicReferencesTagCatalog";
import { PersName } from "./PersName";

describe("PersName", () => {
	it("should display child separated by space", async () => {
		const screen = await render(
			<PersName
				data={{
					tag: "persName",
					value: [
						{
							tag: "addName",
							value: [
								{
									tag: "#text",
									value: "Sir",
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

		expect(screen.container.textContent).toBe("Sir John Doe");
	});
});
