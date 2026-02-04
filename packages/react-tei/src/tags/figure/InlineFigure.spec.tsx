import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../../DocumentContextProvider";
import { I18nProvider } from "../../i18n/I18nProvider";
import type { DocumentJson } from "../../parser/document";
import { DocumentSidePanelContextProvider } from "../../SidePanel/DocumentSidePanelContext";
import { TagCatalogProvider } from "../TagCatalogProvider";
import { figureTagCatalog } from "./figureTagCatalog";
import { InlineFigure } from "./InlineFigure";

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={[]}>
				<DocumentSidePanelContextProvider>
					<TagCatalogProvider tagCatalog={figureTagCatalog}>
						{children}
					</TagCatalogProvider>
				</DocumentSidePanelContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("InlineFigure", () => {
	it("should render a table when type is table", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: { "@type": "table", "@xml:id": "t1" },
			value: [
				{
					tag: "table",
					attributes: {},
					value: [
						{
							tag: "row",
							attributes: {},
							value: [
								{ tag: "cell", attributes: {}, value: "Data 1" },
								{ tag: "cell", attributes: {}, value: "Data 2" },
							],
						},
					],
				},
			],
		};

		const screen = await render(<InlineFigure data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await screen.getByText("Image non disponible").hover();

		await expect.element(screen.getByRole("table")).toBeVisible();
	});

	it("should render unloaded message when value contains only graphic or link", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: {},
			value: [
				{
					tag: "graphic",
				},
				{
					tag: "link",
				},
			],
		};

		const screen = await render(<InlineFigure data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.getByText("Image non disponible"))
			.toBeVisible();
	});

	it("should render unloaded message when value only contains filtered tags", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: {},
			value: [
				{ tag: "graphic", attributes: {}, value: "" },
				{ tag: "link", attributes: {}, value: "" },
				{ tag: "highlightedText", attributes: {}, value: "" },
			],
		};

		const screen = await render(<InlineFigure data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.getByText("Image non disponible"))
			.toBeVisible();
	});

	it("should render tooltip with figure content when value has displayable content", async () => {
		const jsonDocument: DocumentJson = {
			tag: "figure",
			attributes: {},
			value: [
				{ tag: "graphic", attributes: {}, value: "" },
				{
					tag: "head",
					attributes: {},
					value: "Figure 1: Sample Figure",
				},
			],
		};

		const screen = await render(<InlineFigure data={jsonDocument} />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(screen.getByText("Image non disponible"))
			.toBeVisible();
	});
});
