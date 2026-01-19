import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { useFullScreenContext } from "../fullscreen/useFullScreenContext";
import { I18nProvider } from "../i18n/I18nProvider";
import { TableCaption } from "./TableCaption";
import { TagCatalogProvider } from "./TagCatalogProvider";
import { tagCatalog } from "./tagCatalog";

vi.mock("../fullscreen/useFullScreenContext");

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<TagCatalogProvider tagCatalog={tagCatalog}>
				{children}
			</TagCatalogProvider>
		</I18nProvider>
	);
}

describe("TableCaption", () => {
	it("should render caption with label and title", async () => {
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			enterFullScreen: () => {},
			exitFullScreen: () => {},
		});
		const screen = await render(
			<TableCaption
				id="caption1"
				label={{ tag: "head", attributes: {}, value: "Table 1" }}
				titles={[{ tag: "head", attributes: {}, value: "Sample Table" }]}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Table 1 Sample Table");
	});

	it("should render caption with only title", async () => {
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			enterFullScreen: () => {},
			exitFullScreen: () => {},
		});
		const screen = await render(
			<TableCaption
				id="caption2"
				titles={[{ tag: "head", attributes: {}, value: "Only Title" }]}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Only Title");
	});

	it("should render caption with title as array", async () => {
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			enterFullScreen: () => {},
			exitFullScreen: () => {},
		});
		const screen = await render(
			<TableCaption
				id="caption5"
				titles={[
					{ tag: "head", attributes: {}, value: "Title Part 1" },
					{ tag: "head", attributes: {}, value: "Title Part 2" },
				]}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Title Part 1Title Part 2");
	});

	it("should render caption with only label", async () => {
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			enterFullScreen: () => {},
			exitFullScreen: () => {},
		});
		const screen = await render(
			<TableCaption
				id="caption3"
				label={{ tag: "head", attributes: {}, value: "Only Label" }}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(caption).toHaveTextContent("Only Label");
	});

	it("should not render caption when neither label nor title is provided", async () => {
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			enterFullScreen: () => {},
			exitFullScreen: () => {},
		});
		const screen = await render(<TableCaption id="caption4" />, {
			wrapper: TestWrapper,
		});

		expect(screen.getByRole("caption")).not.toBeInTheDocument();
	});

	it("should render the fullscreen button", async () => {
		const enterFullScreen = vi.fn();
		const exitFullScreen = vi.fn();
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			enterFullScreen,
			exitFullScreen,
		});
		const screen = await render(
			<TableCaption
				id="caption6"
				label={{ tag: "head", attributes: {}, value: "Label" }}
				titles={[{ tag: "head", attributes: {}, value: "Title" }]}
			/>,
			{
				wrapper: TestWrapper,
			},
		);

		const button = screen.getByRole("button", {
			name: "Passer en mode plein écran",
		});
		expect(button).toBeVisible();

		const caption = screen.getByRole("caption");
		expect(caption).toBeVisible();
		expect(button).toBeVisible();

		await button.click();
		expect(enterFullScreen).toHaveBeenCalled();
		expect(exitFullScreen).not.toHaveBeenCalled();
	});
});
