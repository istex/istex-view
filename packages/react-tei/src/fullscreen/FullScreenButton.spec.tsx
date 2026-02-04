import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { DocumentContextProvider } from "../DocumentContextProvider";
import { I18nProvider } from "../i18n/I18nProvider";
import { DocumentSidePanelContextProvider } from "../SidePanel/DocumentSidePanelContext";
import { FullScreenButton } from "./FullScreenButton";
import { useFullScreenContext } from "./useFullScreenContext";

vi.mock("./useFullScreenContext");

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<I18nProvider>
			<DocumentContextProvider jsonDocument={[]}>
				<DocumentSidePanelContextProvider>
					{children}
				</DocumentSidePanelContextProvider>
			</DocumentContextProvider>
		</I18nProvider>
	);
}

describe("FullScreenButton", () => {
	it("should open fullscreen on click", async () => {
		const toggleFullScreen = vi.fn();
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			toggleFullScreen,
		});
		const screen = await render(<FullScreenButton />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(
				screen.getByRole("button", {
					name: "Quitter le mode plein écran",
				}),
			)
			.not.toBeInTheDocument();

		await screen
			.getByRole("button", {
				name: "Passer en mode plein écran",
			})
			.click();

		expect(toggleFullScreen).toHaveBeenCalled();
	});

	it("should render close button when already in fullscreen", async () => {
		const toggleFullScreen = vi.fn();
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: true,
			toggleFullScreen,
		});

		const screen = await render(<FullScreenButton />, {
			wrapper: TestWrapper,
		});

		await expect
			.element(
				screen.getByRole("button", {
					name: "Passer en mode plein écran",
				}),
			)
			.not.toBeInTheDocument();

		await expect
			.element(
				screen.getByRole("button", {
					name: "Quitter le mode plein écran",
				}),
			)
			.toBeInTheDocument();
	});
});
