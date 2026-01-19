import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";
import { I18nProvider } from "../i18n/I18nProvider";
import { FullScreenButton } from "./FullScreenButton";
import { useFullScreenContext } from "./useFullScreenContext";

vi.mock("./useFullScreenContext");

describe("FullScreenButton", () => {
	it("should open fullscreen on click", async () => {
		const enterFullScreen = vi.fn();
		const exitFullScreen = vi.fn();
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: false,
			enterFullScreen,
			exitFullScreen,
		});
		const screen = await render(<FullScreenButton />, {
			wrapper({ children }) {
				return <I18nProvider>{children}</I18nProvider>;
			},
		});

		await screen
			.getByRole("button", {
				name: "Passer en mode plein écran",
			})
			.click();

		expect(enterFullScreen).toHaveBeenCalled();
		expect(exitFullScreen).not.toHaveBeenCalled();
	});

	it("should not render button when already in fullscreen", async () => {
		const enterFullScreen = vi.fn();
		const exitFullScreen = vi.fn();
		vi.mocked(useFullScreenContext).mockReturnValue({
			isFullScreen: true,
			enterFullScreen,
			exitFullScreen,
		});

		const screen = await render(<FullScreenButton />, {
			wrapper({ children }) {
				return <I18nProvider>{children}</I18nProvider>;
			},
		});

		await expect
			.element(
				screen.getByRole("button", {
					name: "Passer en mode plein écran",
				}),
			)
			.not.toBeInTheDocument();
	});
});
