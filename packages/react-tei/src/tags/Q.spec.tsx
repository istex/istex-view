import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import { Q } from "./Q";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("Q tag", () => {
	it("should render Q contents with quotes", async () => {
		const screen = await render(
			<Q
				data={{
					tag: "q",
					attributes: {},
					value: [
						{ tag: "#text", attributes: {}, value: "This is a " },
						{
							tag: "hi",
							attributes: {},
							value: [{ tag: "#text", attributes: {}, value: "quote" }],
						},
						{
							tag: "#text",
							attributes: {},
							value: ".",
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		await expect.element(screen.getByText(`"This is a quote."`)).toBeVisible();
	});

	it("should not add quotes if already present", async () => {
		const screen = await render(
			<Q
				data={{
					tag: "q",
					attributes: {},
					value: [
						{ tag: "#text", attributes: {}, value: '"This is a ' },
						{
							tag: "hi",
							attributes: {},
							value: [{ tag: "#text", attributes: {}, value: "quote" }],
						},
						{
							tag: "#text",
							attributes: {},
							value: '."',
						},
					],
				}}
			/>,
			{
				wrapper: TestWrapper,
			},
		);
		screen.debug();

		await expect.element(screen.getByText(`"This is a quote."`)).toBeVisible();
	});
});
