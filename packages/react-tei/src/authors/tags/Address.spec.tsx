import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../../i18n/I18nProvider";
import { TagCatalogProvider } from "../../tags/TagCatalogProvider";
import { authorTagCatalogs } from "../authorsTagCatalog";
import { Address } from "./Address";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={authorTagCatalogs}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("Address", () => {
	it("should render address parts separated by a comma", async () => {
		const screen = await render(
			<Address
				data={{
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
				}}
			/>,
			{
				wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
			},
		);

		await expect
			.element(screen.getByText("123 Main St, Cityville, Wonderland"))
			.toBeInTheDocument();
	});
});
